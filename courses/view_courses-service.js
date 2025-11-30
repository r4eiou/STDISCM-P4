import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function getCourses(call, callback) {
  try {
    // Step 1: get all course_codes in offerings
    const { data: offerings, error: offeringsError } = await supabase
      .from('offerings')
      .select('course_code');

    if (offeringsError) {
      callback(offeringsError, null);
      return;
    }

    const courseCodes = offerings.map((o) => o.course_code);

    // Step 2: get courses that are in offerings
    const { data, error } = await supabase
      .from('courses')
      .select('course_code, title, description')
      .in('course_code', courseCodes);

    if (error) {
      callback(error, null);
      return;
    }

    console.log('Query result:', data); // now this will log

    const response = {
      courses: data.map((c) => ({
        courseCode: c.course_code,
        title: c.title,
        description: c.description,
      })),
    };

    callback(null, response);
  } catch (err) {
    console.error(err);
    callback(err, null);
  }
}