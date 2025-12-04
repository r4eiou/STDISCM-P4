import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY
);

// helper
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function getTimeRange(rangeStr) {
  const timePart = rangeStr.includes(" ") ? rangeStr.split(" ")[1] : rangeStr;
  const [startStr, endStr] = timePart.split("-");
  return {
    start: parseTime(startStr),
    end: parseTime(endStr),
  };
}

function isConflict(a, b) {
  return a.start < b.end && b.start < a.end;
}

// Get available offerings
export async function getOfferings(call, callback) {
  try {
    const { data, error } = await supabase
      .from('offerings')
      .select(`
        faculty_id,
        course_code,
        section,
        time,
        slots,
        remaining,
        courses:course_code (
        course_id,  
        title,
          description
        ),
        faculty:faculty_id (
          firstname,
          lastname
        )
      `);

    if (error) return callback(error, null);

    const response = {
      offerings: data.map((o) => ({
        courseId: o.courses?.course_id,
        courseCode: o.course_code,
        courseName: o.courses?.title ?? "",
        title: o.courses?.title ?? "",
        description: o.courses?.description ?? "",
        sectionNumber: o.section,
        time: o.time,
        remainingSlots: o.remaining,
        maxSlots: o.slots,
        instructor: o.faculty
          ? `${o.faculty.firstname} ${o.faculty.lastname}`
          : "",
      })),
    };

    callback(null, response);
  } catch (err) {
    console.error("getOfferings error:", err);
    callback(err, null);
  }
}

// Return all courses the student is currently enrolled in
export async function getStudentEnrollments(call, callback) {
  const { studentId } = call.request;

  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('course_code, section')
      .eq('student_id', studentId);

    if (error) return callback(error, null);

    callback(null, { enrollments: data });
  } catch (err) {
    console.error("getStudentEnrollments error:", err);
    callback(err, null);
  }
}

// Enroll a student
export async function enroll(call, callback) {
  const { studentId: accountId, courseCode, section } = call.request; // accountId is UUID

  try {
    // 1. Map accountId to student_id
    const { data: studentData, error: studentError } = await supabase
      .from('student')
      .select('student_id')
      .eq('account_id', accountId)
      .single();

    if (studentError || !studentData) {
      return callback(null, { success: false, message: 'Student not found' });
    }

    const studentId = studentData.student_id;

    // 2a. Check if student already enrolled in the same course (any section)
    const { data: anySection, error: anySectionError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_code', courseCode)
      .single();

    if (anySection) {
      return callback(null, { 
        success: false, 
        message: 'You are already enrolled in this course' 
      });
    }

    // 2b. Check if student already enrolled / taken the course
    const { data: existing } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_code', courseCode)
      .eq('section', section)
      .single();

    if (existing) {
      return callback(null, { 
        success: false, 
        message: 'You have already taken this course'
      });
    }

    // 2c. Get time of desired course AND faculty_id
    const { data: newOffering, error: offeringFetchError } = await supabase
      .from("offerings")
      .select("time, faculty_id")
      .eq("course_code", courseCode)
      .eq("section", section)
      .single();

    if (offeringFetchError || !newOffering) {
      return callback(null, { 
        success: false, 
        message: 'Course offering not found' 
      });
    }

    const newRange = getTimeRange(newOffering.time);
    const facultyId = newOffering.faculty_id;

    const { data: enrolledClasses } = await supabase
      .from("enrollments")
      .select("course_code, section")
      .eq("student_id", studentId);

    for (const cls of enrolledClasses) {
      const { data: off } = await supabase
        .from("offerings")
        .select("time")
        .eq("course_code", cls.course_code)
        .eq("section", cls.section)
        .single();

      if (!off) continue;

      const existingRange = getTimeRange(off.time);

      if (isConflict(existingRange, newRange)) {
        return callback(null, {
          success: false,
          message: `Time conflict with ${cls.course_code} ${cls.section}`,
        });
      }
    }

    // 3. Check remaining slots
    const { data: offering, error: offeringError } = await supabase
      .from('offerings')
      .select('remaining')
      .eq('course_code', courseCode)
      .eq('section', section)
      .single();

    if (offeringError || !offering) {
      return callback(null, { 
        success: false, 
        message: 'Course not found' 
      });
    }

    if (offering.remaining <= 0) {
      return callback(null, { 
        success: false, 
        message: 'No slots available' 
      });
    }

    // 4. Insert into enrollments
    const { data: enrollData, error: enrollError } = await supabase
      .from('enrollments')
      .insert({ student_id: studentId, course_code: courseCode, section });

    if (enrollError) {
      return callback(null, { 
        success: false, 
        message: enrollError.message 
      });
    }

    // 5. Create grade record for this enrollment
    const { error: gradeError } = await supabase
      .from('grades')
      .insert({
        student_id: studentId,
        course_code: courseCode,
        section: section,
        grade: 0, // or null if your schema allows
        status: 'ongoing',
        faculty_id: facultyId
      });

    if (gradeError) {
      console.error('Failed to create grade record:', gradeError);
      // Note: Enrollment was already created, so we continue
      // In production, you might want to rollback the enrollment
    }

    // 6. Decrement remaining slots
    await supabase
      .from('offerings')
      .update({ remaining: offering.remaining - 1 })
      .eq('course_code', courseCode)
      .eq('section', section);

    callback(null, { 
      success: true, 
      message: 'Enrolled successfully' 
    });
  } catch (err) {
    console.error("Enroll error:", err);
    callback(err, null);
  }
}