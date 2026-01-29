import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zpugojidoppmnintjdpy.supabase.co'
const supabaseKey = 'sb_publishable_aV-dhbk2T6Suj3D5TZyrGw_W3vp0HNH'
const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log("Fetching 1 enrollment...")
    const { data, error } = await supabase.from('enrollments').select('*').limit(1)
    if (error) {
        console.error("Error:", error)
    } else {
        console.log("Success:", data)
    }
}

main()
