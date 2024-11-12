import express from 'express';
import bcrypt from 'bcrypt';
import { Admin } from './models/Admin.js';
import './db.js';

async function AdminAccount() {
  const admins = [
    { username: 'admin1', password: 'adminpassword1', role: 'adminPage1' },
    { username: 'admin2', password: 'adminpassword2', role: 'adminPage2' },
    { username: 'admin3', password: 'adminpassword3', role: 'adminPage3' }
  ];

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      for (let admin of admins) {
        const hashPassword = await bcrypt.hash(admin.password, 10);
        const newAdmin = new Admin({
          username: admin.username,
          password: hashPassword,
          role: admin.role
        });
        await newAdmin.save();
        console.log(`Tạo tài khoản cho ${admin.username} thành công`);
      }
    } else {
      console.log('Các tài khoản admin đã tồn tại');
    }
  } catch (err) {
    console.log('Lỗi:', err);
  }
}

AdminAccount();
