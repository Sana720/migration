
const { createClient } = require('@supabase/supabase-js');
// Path to the .env of the project we want to check
const envPath = '/Users/ahmadsana/Documents/maintenance_saas/admin-app/.env';
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    const url = envConfig.NEXT_PUBLIC_SUPABASE_URL;
    const key = envConfig.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(url, key);

    async function checkConfig() {
        console.log('--- Payment Gateway Configs ---');
        const { data: configs, error: err1 } = await supabase
            .from('payment_gateway_configs')
            .select('*')
            .eq('gateway_provider', 'razorpay');

        if (err1) console.error(err1);
        else console.log(JSON.stringify(configs, null, 2));

        console.log('\n--- Tenants With Razorpay IDs ---');
        const { data: tenants, error: err2 } = await supabase
            .from('tenants')
            .select('id, name, razorpay_account_id')
            .not('razorpay_account_id', 'is', null);

        if (err2) console.error(err2);
        else console.log(JSON.stringify(tenants, null, 2));
    }

    checkConfig();
} else {
    console.error('.env not found at', envPath);
}
