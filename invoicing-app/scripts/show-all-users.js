const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showAllUsers() {
    try {
        console.log('\n');
        console.log('╔═══════════════════════════════════════════════════════════════════╗');
        console.log('║                    ALL REGISTERED USERS                           ║');
        console.log('╚═══════════════════════════════════════════════════════════════════╝');
        console.log('\n');

        // Get all users with their sessions
        const users = await prisma.user.findMany({
            include: {
                sessions: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                invoices: true,
                clients: true
            }
        });

        if (users.length === 0) {
            console.log('❌ No users found in database.');
            console.log('');
            return;
        }

        console.log(`📊 Total Users: ${users.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n');

        users.forEach((user, index) => {
            console.log(`┌─────────────────────────────────────────────────────────────────┐`);
            console.log(`│  USER #${index + 1}                                                        │`);
            console.log(`└─────────────────────────────────────────────────────────────────┘`);
            console.log('');
            
            // Basic Information
            console.log('📋 BASIC INFORMATION:');
            console.log(`   User ID        : ${user.id}`);
            console.log(`   Full Name      : ${user.name}`);
            console.log(`   Email Address  : ${user.email}`);
            console.log(`   Phone Number   : ${user.phone || 'Not provided'}`);
            console.log(`   Company        : ${user.company || 'Not provided'}`);
            console.log(`   Role           : ${user.role.toUpperCase()}`);
            console.log('');

            // Account Dates
            console.log('📅 ACCOUNT DATES:');
            console.log(`   Created On     : ${user.createdAt.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`);
            console.log(`   Last Updated   : ${user.updatedAt.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`);
            console.log('');

            // Password Info (hashed)
            console.log('🔒 SECURITY:');
            console.log(`   Password Hash  : ${user.password.substring(0, 30)}... (Encrypted)`);
            console.log(`   Hash Length    : ${user.password.length} characters`);
            console.log('');

            // Sessions
            console.log('🔐 LOGIN SESSIONS:');
            if (user.sessions.length > 0) {
                console.log(`   Total Sessions : ${user.sessions.length}`);
                user.sessions.forEach((session, sessionIndex) => {
                    const isExpired = session.expiresAt < new Date();
                    const status = isExpired ? '❌ EXPIRED' : '✅ ACTIVE';
                    console.log(`   
   Session ${sessionIndex + 1}:`);
                    console.log(`     Token        : ${session.token.substring(0, 25)}...`);
                    console.log(`     Created      : ${session.createdAt.toLocaleString()}`);
                    console.log(`     Expires      : ${session.expiresAt.toLocaleString()}`);
                    console.log(`     Status       : ${status}`);
                });
            } else {
                console.log('   No active sessions');
            }
            console.log('');

            // Activity Statistics
            console.log('📊 ACTIVITY STATISTICS:');
            console.log(`   Total Clients  : ${user.clients.length}`);
            console.log(`   Total Invoices : ${user.invoices.length}`);
            
            if (user.invoices.length > 0) {
                const totalRevenue = user.invoices.reduce((sum, inv) => sum + inv.total, 0);
                const paidInvoices = user.invoices.filter(inv => inv.status === 'paid').length;
                console.log(`   Paid Invoices  : ${paidInvoices}`);
                console.log(`   Total Revenue  : $${totalRevenue.toFixed(2)}`);
            }
            console.log('');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('\n');
        });

        // Summary
        const totalSessions = users.reduce((sum, user) => sum + user.sessions.length, 0);
        const activeSessions = users.reduce((sum, user) => {
            return sum + user.sessions.filter(s => s.expiresAt > new Date()).length;
        }, 0);
        const totalClients = users.reduce((sum, user) => sum + user.clients.length, 0);
        const totalInvoices = users.reduce((sum, user) => sum + user.invoices.length, 0);

        console.log('╔═══════════════════════════════════════════════════════════════════╗');
        console.log('║                         SUMMARY                                   ║');
        console.log('╚═══════════════════════════════════════════════════════════════════╝');
        console.log('');
        console.log(`   👤 Total Users          : ${users.length}`);
        console.log(`   🔐 Total Sessions       : ${totalSessions}`);
        console.log(`   ✅ Active Sessions      : ${activeSessions}`);
        console.log(`   👥 Total Clients        : ${totalClients}`);
        console.log(`   📄 Total Invoices       : ${totalInvoices}`);
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('✅ DATABASE STATUS: All user data is permanently saved in SQLite!');
        console.log('✅ Users can login anytime with their registered credentials.');
        console.log('✅ Data persists even after server restart.');
        console.log('');

    } catch (error) {
        console.error('❌ Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

showAllUsers();
