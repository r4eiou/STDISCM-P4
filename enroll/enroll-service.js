import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY
);

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

// Enroll a student
export async function enroll(call, callback) {
  const { studentId, courseCode, section } = call.request;

  try {
    // check remaining slots
    const { data: offering, error } = await supabase
      .from('offerings')
      .select('remaining')
      .eq('course_code', courseCode)
      .eq('section', section)
      .single();

    if (error || !offering) {
      return callback(null, { success: false, message: 'Course not found' });
    }

    if (offering.remaining <= 0) {
      return callback(null, { success: false, message: 'No slots available' });
    }

    // insert into enrollments table
    await supabase.from('enrollments').insert({
      student_id: studentId,
      course_code: courseCode,
      section
    });

    // decrement remaining slots
    await supabase
      .from('offerings')
      .update({ remaining: offering.remaining - 1 })
      .eq('course_code', courseCode)
      .eq('section', section);

    callback(null, { success: true, message: 'Enrolled successfully' });
  } catch (err) {
    callback(err, null);
  }
}