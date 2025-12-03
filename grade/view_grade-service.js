import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function getGrade(call, callback) {
  const { accountId } = call.request;

  try {
    // Step 1: Get student_id from account_id
    const { data: student, error: studentError } = await supabase
      .from('student')
      .select('student_id')
      .eq('account_id', accountId)
      .single();

    if (studentError || !student) {
      callback(null, { grades: [] });
      return;
    }

    const studentId = student.student_id;

    // Step 2: Get completed grades for student
    const { data: grades, error: gradesError } = await supabase
      .from('grades')
      .select('course_code, section, grade, status')
      .eq('student_id', studentId)
      .eq('status', 'completed');

    if (gradesError) {
      callback(gradesError, null);
      return;
    }

    // Step 3: Fetch course titles
    const courseCodes = grades.map(g => g.course_code);

    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('course_code, title')
      .in('course_code', courseCodes);

    if (coursesError) {
      callback(coursesError, null);
      return;
    }

    // Map course_code to title
    const courseMap = {};
    courses.forEach(c => {
      courseMap[c.course_code] = c.title;
    });

    // Step 4: Build response
    const response = {
      grades: grades.map(g => ({
        courseCode: g.course_code,
        courseTitle: courseMap[g.course_code] || '',
        section: g.section,
        grade: g.grade,
        status: g.status,
      }))
    };

    // debug log:
    // console.log("Final response:", response);
    callback(null, response);

  } catch (err) {
    console.error(err);
    callback(err, null);
  }
}
