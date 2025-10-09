import { NextResponse } from 'next/server';
import { DatabaseService } from '../../../../services/database';

export async function GET() {
  try {
    const isConnected = await DatabaseService.testConnection();
    const users = await DatabaseService.getAllUsers();
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      storage: isConnected ? 'PostgreSQL' : 'In-Memory',
      userCount: users.length,
      users: users.map(user => ({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        created_at: user.created_at 
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      connected: false,
      storage: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}