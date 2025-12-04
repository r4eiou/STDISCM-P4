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
  console.log('Faculty account ID:', facultyId);

  try {
    // Step 1: Get faculty's faculty_id from account_id
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
    console.log('Faculty ID (numeric):', facultyIdNum);

    // Step 2: Get all grades for this faculty (both ongoing and completed)
    const { data: grades, error: gradesError } = await supabase
      .from('grades')
      .select('student_id, course_code, section, grade, status')
      .eq('faculty_id', facultyIdNum);

    console.log('Grades found:', { count: grades?.length, grades, gradesError });

    if (gradesError) {
      console.error('Error fetching grades:', gradesError);
      callback(gradesError, null);
      return;
    }

    if (!grades || grades.length === 0) {
      console.log('No grades found for this faculty');
      callback(null, { students: [] });
      return;
    }

    // Step 3: Get unique student IDs and course codes
    const studentIds = [...new Set(grades.map(g => g.student_id))];
    const courseCodes = [...new Set(grades.map(g => g.course_code))];

    console.log('Student IDs:', studentIds);
    console.log('Course codes:', courseCodes);

    // Step 4: Get student details
    const { data: students, error: studentsError } = await supabase
      .from('student')
      .select('student_id, firstname, lastname, account_id')
      .in('student_id', studentIds);

    console.log('Students:', { students, studentsError });

    if (studentsError) {
      callback(studentsError, null);
      return;
    }

    // Step 5: Get account emails
    const accountIds = students.map(s => s.account_id);
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('user_id, email')
      .in('user_id', accountIds);

    console.log('Accounts:', { accounts, accountsError });

    // Step 6: Get course titles
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('course_code, title')
      .in('course_code', courseCodes);

    console.log('Courses:', { courses, coursesError });

    // Step 7: Build lookup maps
    const studentMap = {};
    students.forEach(s => {
      const account = accounts?.find(a => a.user_id === s.account_id);
      studentMap[s.student_id] = {
        name: `${s.firstname || ''} ${s.lastname || ''}`.trim(),
        email: account?.email || ''
      };
    });

    const courseMap = {};
    (courses || []).forEach(c => {
      courseMap[c.course_code] = c.title;
    });

    // Step 8: Build response
    const response = {
        students: grades.map(g => ({
            studentId: g.student_id,
            studentName: studentMap[g.student_id]?.name || 'Unknown Student',
            studentEmail: studentMap[g.student_id]?.email || '',
            courseCode: g.course_code,
            courseTitle: courseMap[g.course_code] || g.course_code,
            section: g.section,
            currentGrade: g.grade, // DON'T convert to 0, keep as null
            status: g.status || 'ongoing'
        }))
        };

    console.log('=== Final response ===');
    console.log('Total students:', response.students.length);
    console.log('Sample:', response.students[0]);
    
    callback(null, response);

  } catch (err) {
    console.error('Unexpected error in getStudentsByFaculty:', err);
    callback(err, null);
  }
}

export async function uploadGrade(call, callback) {
  const { studentId, courseCode, section, grade, facultyId } = call.request;

  console.log('=== UploadGrade called ===');
  console.log({ studentId, courseCode, section, grade, facultyId });

  try {
    // Step 1: Get faculty's numeric ID
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty')
      .select('faculty_id')
      .eq('account_id', facultyId)
      .single();

    if (facultyError || !faculty) {
      console.log('Faculty not found');
      callback(null, { success: false, message: 'Faculty not found' });
      return;
    }

    const facultyIdNum = faculty.faculty_id;
    console.log('Faculty ID (numeric):', facultyIdNum);

    // Step 2: Verify this grade record exists for this faculty
    const { data: existingGrade, error: gradeCheckError } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_code', courseCode)
      .eq('section', section)
      .eq('faculty_id', facultyIdNum)
      .maybeSingle();

    console.log('Existing grade check:', { existingGrade, gradeCheckError });

    if (!existingGrade) {
      console.log('Grade record not found for this faculty');
      callback(null, { 
        success: false, 
        message: 'You are not authorized to grade this enrollment or enrollment not found' 
      });
      return;
    }

    // Step 3: Determine status based on grade
    // CHANGED: Use 'completed' instead of 'passed'/'failed'
    let gradeStatus = 'ongoing';
    if (grade >= 1.0 && grade <= 5.0) {
      gradeStatus = 'completed';
    }

    console.log('Grade status determined:', gradeStatus);

    // Step 4: Update the grade
    const { error: updateError } = await supabase
      .from('grades')
      .update({ 
        grade: grade,
        status: gradeStatus
      })
      .eq('student_id', studentId)
      .eq('course_code', courseCode)
      .eq('section', section)
      .eq('faculty_id', facultyIdNum);

    if (updateError) {
      console.error('Database error:', updateError);
      callback(null, { success: false, message: updateError.message });
      return;
    }

    console.log('Grade successfully updated');
    callback(null, { 
      success: true, 
      message: `Grade ${grade} uploaded successfully. Status: ${gradeStatus}` 
    });

  } catch (err) {
    console.error('Error in uploadGrade:', err);
    callback(null, { success: false, message: err.message });
  }
}