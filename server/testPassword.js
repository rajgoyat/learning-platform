const mongoose = require('mongoose');
const User = require('./models/User');

const testPassword = async () => {
  try {
    await mongoose.connect('mongodb+srv://learningdb:kQJ@##4Uk@2N9@cluster0.hqpmx.mongodb.net/learning?retryWrites=true&w=majority');
    
    const user = await User.findOne({ email: 'priya.sharma@edutech.com' }).select('+password');
    if (user) {
      console.log('✓ User found:', user.name);
      console.log('✓ Email:', user.email);
      console.log('✓ Password hash exists:', user.password ? 'YES' : 'NO');
      
      // Test password match
      const isMatch = await user.matchPassword('Teacher@123');
      console.log('✓ Password "Teacher@123" matches:', isMatch);
      
      if (isMatch) {
        console.log('\n✅ SUCCESS! Login should work now.');
      } else {
        console.log('\n❌ Password mismatch - there may still be an issue.');
      }
    } else {
      console.log('❌ User not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

testPassword();
