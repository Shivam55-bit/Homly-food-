import { Router, Request, Response } from 'express';
import { db } from '../db';
import { User } from '../../src/types';

export const authRouter = Router();

// POST /api/v1/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { phoneOrEmail } = req.body;
    if (!phoneOrEmail) {
      return res.status(400).json({ success: false, message: 'Phone or email is required' });
    }

    const cleanQuery = phoneOrEmail.toLowerCase().trim();
    let user = db.users.find(u => 
      u.phone.includes(phoneOrEmail) || 
      u.email.toLowerCase().includes(cleanQuery) ||
      (cleanQuery.includes('vendor') && u.role === 'vendor') ||
      (cleanQuery.includes('admin') && u.role === 'admin')
    );

    if (!user) {
      if (cleanQuery.includes('vendor')) {
        user = db.users.find(u => u.role === 'vendor') || db.users[1];
      } else if (cleanQuery.includes('admin')) {
        user = db.users.find(u => u.role === 'admin') || db.users[2];
      } else {
        user = {
          id: `usr-${Date.now()}`,
          name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Valued Customer',
          email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail.replace(/\D/g, '')}@homlyfood.com`,
          phone: phoneOrEmail.startsWith('+') ? phoneOrEmail : `+91 ${phoneOrEmail}`,
          role: 'customer',
          dietaryPreference: 'veg',
          walletBalance: 200,
          createdAt: new Date().toISOString(),
          addresses: [
            {
              id: `addr-${Date.now()}`,
              label: 'Home',
              street: '12th Main Road, HAL 2nd Stage',
              area: 'Indiranagar',
              city: 'Bangalore',
              pincode: '560008',
              isDefault: true
            }
          ]
        };
        db.users.push(user);
        db.persist();
      }
    }

    return res.json({
      success: true,
      message: 'Login successful',
      user,
      token: `jwt_token_${user.id}_${Date.now()}`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/auth/register
authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { name, phone, email, dietaryPreference, street, area, city, pincode, role, kitchenName } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const existingUser = db.users.find(u => u.phone === phone || (email && u.email.toLowerCase() === email.toLowerCase()));
    if (existingUser) {
      return res.json({
        success: true,
        message: 'Account already exists, logged in',
        user: existingUser,
        token: `jwt_token_${existingUser.id}_${Date.now()}`
      });
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      phone: phone.startsWith('+') ? phone : `+91 ${phone}`,
      email: email || `${phone.replace(/\D/g, '')}@homlyfood.com`,
      role: role || 'customer',
      dietaryPreference: dietaryPreference || 'veg',
      walletBalance: 200,
      createdAt: new Date().toISOString(),
      addresses: street ? [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          street,
          area: area || 'Indiranagar',
          city: city || 'Bangalore',
          pincode: pincode || '560038',
          isDefault: true
        }
      ] : []
    };

    if (role === 'vendor') {
      newUser.kitchenName = kitchenName || `${name}'s Kitchen`;
      newUser.vendorId = `ven-${Date.now()}`;
    }

    db.users.unshift(newUser);
    db.persist();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
      token: `jwt_token_${newUser.id}_${Date.now()}`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/v1/auth/send-otp
authRouter.post('/send-otp', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });
  // Simulated instant OTP (5432)
  return res.json({
    success: true,
    message: `OTP sent successfully to ${phone}`,
    otpDebug: '5432'
  });
});

// POST /api/v1/auth/verify-otp
authRouter.post('/verify-otp', (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
  
  if (otp === '5432' || otp.length === 4) {
    let user = db.users.find(u => u.phone.includes(phone));
    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: 'Verified Customer',
        phone: phone.startsWith('+') ? phone : `+91 ${phone}`,
        email: `${phone.replace(/\D/g, '')}@homlyfood.com`,
        role: 'customer',
        dietaryPreference: 'veg',
        walletBalance: 200,
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      db.persist();
    }
    return res.json({
      success: true,
      message: 'OTP verified successfully',
      user,
      token: `jwt_token_${user.id}_${Date.now()}`
    });
  }

  return res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter 5432.' });
});

// PUT /api/v1/auth/profile
authRouter.put('/profile', (req: Request, res: Response) => {
  try {
    const { id, ...updates } = req.body;
    const userId = id || req.body.userId || db.users[0].id;
    const index = db.users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updatedUser = { ...db.users[index], ...updates };
    db.users[index] = updatedUser;
    db.persist();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
