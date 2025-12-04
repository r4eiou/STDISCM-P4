import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function getStudentsByFaculty(call, callback) {
  const { facultyId } = call.request;

  console.log('=== GetStudentsByFaculty called ===');
  console.log('Faculty ID:', facultyId);

  try {
    // Get faculty's faculty_id from account_id
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty')
      .select('faculty_id')
      .eq('account_id', facultyId)
      .single();

    console.log('Faculty lookup:', { faculty, facultyError });

    if (facultyError || !faculty) {
      console.log('Faculty not found, returning empty array');
      callback(null, { students: [] });
      return;
    }

    const facultyIdNum = faculty.faculty_id;

    // Get all courses taught by this faculty with enrollments
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('course_code, title')
      .eq('faculty_id', facultyIdNum);

    console.log('Courses:', { coursesData, coursesError });

    if (coursesError || !coursesData || coursesData.length === 0) {
      console.log('No courses found for faculty');
      callback(null, { students: [] });
      return;
    }

    const courseCodes = coursesData.map(c => c.course_code);

    // Get all enrollments for these courses
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('student_id, course_code, section')
      .in('course_code', courseCodes);

    console.log('Enrollments:', { enrollments, enrollError });

    if (enrollError || !enrollments || enrollments.length === 0) {
      console.log('No enrollments found');
      callback(null, { students: [] });
      return;
    }

    // Get student details
    const studentIds = [...new Set(enrollments.map(e => e.student_id))];
    
    const { data: students, error: studentsError } = await supabase
      .from('student')
      .select('student_id, account_id')
      .in('student_id', studentIds);

    console.log('Students:', { students, studentsError });

    if (studentsError) {
      callback(studentsError, null);
      return;
    }

    // Get account details
    const accountIds = students.map(s => s.account_id);
    const { data: accounts, error: accountsError } = await supabase
      .from('account')
      .select('account_id, email, firstname, lastname')
      .in('account_id', accountIds);

    console.log('Accounts:', { accounts, accountsError });

    // Get existing grades
    const { data: grades, error: gradesError } = await supabase
      .from('grades')
      .select('student_id, course_code, section, grade, status')
      .in('student_id', studentIds)
      .in('course_code', courseCodes);

    console.log('Grades:', { grades, gradesError });

    // Build maps
    const studentMap = {};
    students.forEach(s => {
      const account = accounts.find(a => a.account_id === s.account_id);
      studentMap[s.student_id] = {
        name: `${account?.firstname || ''} ${account?.lastname || ''}`,
        email: account?.email || ''
      };
    });

    const courseMap = {};
    coursesData.forEach(c => {
      courseMap[c.course_code] = c.title;
    });

    const gradeMap = {};
    (grades || []).forEach(g => {
      const key = `${g.student_id}-${g.course_code}-${g.section}`;
      gradeMap[key] = { grade: g.grade, status: g.status };
    });

    // Build response
    const response = {
      students: enrollments.map(e => {
        const key = `${e.student_id}-${e.course_code}-${e.section}`;
        const gradeData = gradeMap[key] || { grade: 0, status: 'ongoing' };
        
        return {
          studentId: e.student_id,
          studentName: studentMap[e.student_id]?.name || '',
          studentEmail: studentMap[e.student_id]?.email || '',
          courseCode: e.course_code,
          courseTitle: courseMap[e.course_code] || '',
          section: e.section,
          currentGrade: gradeData.grade,
          status: gradeData.status
        };
      })
    };

    console.log('Final response:', response);
    callback(null, response);

  } catch (err) {
    console.error('Error in getStudentsByFaculty:', err);
    callback(err, null);
  }
}

export async function uploadGrade(call, callback) {
  const { studentId, courseCode, section, grade, facultyId } = call.request;

  console.log('=== UploadGrade called ===');
  console.log({ studentId, courseCode, section, grade, facultyId });

  try {
    // Verify faculty exists
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty')
      .select('faculty_id')
      .eq('account_id', facultyId)
      .single();

    if (facultyError || !faculty) {
      callback(null, { success: false, message: 'Faculty not found' });
      return;
    }

    // Check if enrollment exists
    const { data: enrollment, error: enrollError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_code', courseCode)
      .eq('section', section)
      .single();

    if (enrollError || !enrollment) {
      callback(null, { success: false, message: 'Enrollment not found' });
      return;
    }

    // Check if grade exists
    const { data: existingGrade } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_code', courseCode)
      .eq('section', section)
      .maybeSingle();

    let result;
    const gradeStatus = grade >= 1.0 ? 'completed' : 'ongoing';

    if (existingGrade) {
      // Update
      result = await supabase
        .from('grades')
        .update({ grade, status: gradeStatus })
        .eq('student_id', studentId)
        .eq('course_code', courseCode)
        .eq('section', section);
    } else {
      // Insert
      result = await supabase
        .from('grades')
        .insert({
          student_id: studentId,
          course_code: courseCode,
          section: section,
          grade,
          status: gradeStatus
        });
    }

    if (result.error) {
      console.error('Database error:', result.error);
      callback(null, { success: false, message: result.error.message });
      return;
    }

    callback(null, { success: true, message: 'Grade uploaded successfully' });

  } catch (err) {
    console.error('Error in uploadGrade:', err);
    callback(null, { success: false, message: err.message });
  }
}