# Course Publishing System - Complete Testing Guide

## 🎯 Full Implementation Status

### ✅ Backend (DONE)
- ✅ Course Model - Status enum with Draft/Active/Published
- ✅ Controllers - updateCourse() and publishCourse() functions
- ✅ Routes - PATCH and PUT endpoints
- ✅ Error handling - Comprehensive validation
- ✅ Authorization - Owner-only checks

### ✅ Frontend (DONE)
- ✅ TeacherDashboard - Integrated with new API
- ✅ StudentDashboard - Filtering draft courses
- ✅ Handler functions - handleUpdateCourse() and handlePublishCourse()
- ✅ UI buttons - Publish/Unpublish buttons added
- ✅ Status display - Color-coded badges (Orange=Draft, Green=Active)

---

## 🚀 How to Test

### Prerequisites
```bash
# Terminal 1 - Backend
cd server
npm run dev
# Expected: MongoDB connected, Server running on port 5000

# Terminal 2 - Frontend
cd ai-learning
npm start
# Opens: http://localhost:3000
```

---

## 🧪 Test Scenarios

### Test 1: Create Course as Draft
**Goal**: Verify courses default to Draft status

**Steps**:
1. Login as teacher (or register)
2. Click "Courses" tab
3. Click "Add New Course"
4. Fill in:
   - Title: "Test Course"
   - Description: "Test description"
   - Concept: "Test concept"
   - Modules: 5
5. Leave Status as "Draft (Not Visible to Students)"
6. Click "Create Course"

**Expected Results**:
- ✅ Course appears in list with ORANGE badge "Draft"
- ✅ Message: "Course saved as Draft..."
- ✅ Course not visible if you login as student

---

### Test 2: Publish a Draft Course
**Goal**: Verify publishing workflow

**Steps**:
1. In Teacher Dashboard course list
2. Find the Draft course from Test 1
3. Click "View / Edit"
4. In course details, click "✓ Publish" button

**Expected Results**:
- ✅ Badge changes ORANGE → GREEN
- ✅ Status shows "Active"
- ✅ Button changes "Publish" → "Unpublish"
- ✅ Message: "Course published successfully!"
- ✅ Course NOT visible immediately (refresh page or logout/login as student)

---

### Test 3: Verify Student Can See Published Course
**Goal**: Confirm student visibility

**Steps**:
1. Logout from teacher account
2. Login as student (use different email)
3. Click "Explore Courses" or go to student dashboard
4. Search for the course from Tests 1 & 2

**Expected Results**:
- ✅ Published course appears
- ✅ Status shows "Active" or no warning
- ✅ No Draft courses visible
- ✅ Only see published courses

---

### Test 4: Unpublish a Course
**Goal**: Verify unpublishing removes student visibility

**Steps**:
1. Login as teacher
2. Go to published course details
3. Click "↓ Unpublish" button

**Expected Results**:
- ✅ Badge changes GREEN → ORANGE
- ✅ Status shows "Draft"
- ✅ Button changes "Unpublish" → "Publish"
- ✅ Message: "Course updated successfully!"

**Verify removal**:
1. Logout
2. Login as student
3. Go to Explore Courses
- ✅ Course no longer visible

---

### Test 5: Quick Publish from Course Card
**Goal**: Verify one-click publishing from course list

**Steps**:
1. Create a new Draft course (Test 1 steps)
2. In course list, find the Draft course
3. Click "Publish →" button directly on card

**Expected Results**:
- ✅ Course updates without opening details view
- ✅ Badge changes from orange to green
- ✅ Button disappears (no longer showing "Publish →")
- ✅ Success message shows

---

### Test 6: Edit Course via PATCH
**Goal**: Verify course editing updates correctly

**Steps**:
1. Create or open a course
2. Click "View / Edit"
3. In course details:
   - Note current status and details
4. Want to verify PATCH works - check browser DevTools Network tab
5. Try publishing (will trigger PUT request to /publish)

**Expected Results**:
- ✅ Network tab shows PUT request to `/api/courses/{id}/publish`
- ✅ Request headers include: `Authorization: Bearer {token}`
- ✅ Response: 200 OK with updated course object
- ✅ Course status in response shows "Active"

---

### Test 7: Error Handling - Publish Invalid Course
**Goal**: Verify validation

**Steps**:
1. Create course but leave Description empty (if frontend allows)
2. Or manually test via API:
```bash
curl -X PUT http://localhost:5000/api/courses/INVALID_ID/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Results**:
- ✅ Error message appears
- ✅ Course not updated
- ✅ Status remains unchanged

---

### Test 8: Authorization - Try Editing Other Teacher's Course
**Goal**: Verify ownership check

**Steps**:
1. Create course as Teacher A
2. Logout
3. Login as Teacher B
4. In browser DevTools, try:
```javascript
fetch('http://localhost:5000/api/courses/TEACHER_A_COURSE_ID', {
  method: 'PATCH',
  headers: { 
    'Authorization': `Bearer ${teacherB_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'Draft' })
});
```

**Expected Results**:
- ✅ Error: 403 Forbidden
- ✅ Message: "You can only update your own courses"
- ✅ Course not modified

---

### Test 9: Full User Journey - Teacher
**Goal**: Complete workflow from creation to publishing

**Steps**:
1. Register as new teacher
2. Create 3 courses:
   - Course 1: Leave as Draft
   - Course 2: Publish immediately
   - Course 3: Create as Draft
3. Edit Course 1: publish it
4. Edit Course 2: unpublish it
5. Verify status on course cards

**Expected Results**:
- ✅ All buttons work correctly
- ✅ Status badges update properly
- ✅ Messages show for each action
- ✅ Page remains responsive

---

### Test 10: Full User Journey - Student
**Goal**: Confirm student only sees published courses

**Steps**:
1. Register as student
2. Go to Explore/browse courses
3. From Test 9 verify:
   - Course 2 visible (was published)
   - Course 1 NOT visible initially (was draft)
   - After teacher publishes Course 1 (Test 9 step 3):
     - Refresh page
     - Course 1 NOW visible

**Expected Results**:
- ✅ Only published courses in list
- ✅ No draft courses visible
- ✅ Real-time updates when refreshed
- ✅ Course count accurate

---

## 🐛 Debugging Tips

### Check Network Requests
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Perform action (Publish, Unpublish)
4. Look for:
   - `PUT /api/courses/{id}/publish` for publishing
   - `PATCH /api/courses/{id}` for updating
5. Click request → Response tab to see returned data

### Check Browser Console
1. Ctrl+Shift+J (DevTools Console)
2. Should see no errors
3. Look for success messages

### Backend Logs
1. Check server terminal
2. Should see:
```
MongoDB connected
GET /api/courses/mine 200
PUT /api/courses/XXXX/publish 200
```

### Check Database
1. Go to MongoDB Atlas
2. Navigate to "learning" database
3. Check Courses collection
4. Find your test course
5. Verify status field shows "Active" or "Draft"

---

## ✅ Checklist - All Tests Complete

- [ ] Test 1: Create Course as Draft
- [ ] Test 2: Publish a Draft Course
- [ ] Test 3: Student Can See Published
- [ ] Test 4: Unpublish a Course
- [ ] Test 5: Quick Publish from Card
- [ ] Test 6: Edit Course via PATCH
- [ ] Test 7: Error Handling
- [ ] Test 8: Authorization Check
- [ ] Test 9: Teacher Full Journey
- [ ] Test 10: Student Full Journey

---

## 🎓 Expected API Response Examples

### Publish Course Response
```json
{
  "success": true,
  "message": "Course published successfully",
  "course": {
    "id": "641a2b3c4d5e6f7g8h9i",
    "title": "Machine Learning Basics",
    "description": "Complete ML guide",
    "concept": "Understanding ML",
    "status": "Active",
    "modules": 5,
    "students": 0,
    "contentType": "Video",
    "videoUrl": "https://...",
    "teacherName": "John Doe",
    "createdAt": "2026-04-02T10:00:00Z",
    "updatedAt": "2026-04-02T10:30:00Z"
  }
}
```

### Update Course Response
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    "id": "641a2b3c4d5e6f7g8h9i",
    "status": "Draft",
    "modules": 8,
    "updatedAt": "2026-04-02T10:35:00Z"
  }
}
```

### Error Response
```json
{
  "message": "You can only update your own courses"
}
```

---

## 📊 Success Indicators

| Indicator | Expected | Check |
|-----------|----------|-------|
| Draft Badge Color | Orange/Warning | ✅ |
| Active Badge Color | Green/Success | ✅ |
| Publish Button Shows | When status=Draft | ✅ |
| Unpublish Button Shows | When status=Active | ✅ |
| Student Sees Drafts | Never | ✅ |
| Student Sees Published | Always | ✅ |
| Teacher Sees Own Drafts | In /courses/mine | ✅ |
| Success Messages | Clear & helpful | ✅ |
| Error Messages | Descriptive | ✅ |
| No Console Errors | Clean console | ✅ |

---

## 🚀 When All Tests Pass

1. ✅ Course publishing system working
2. ✅ Student visibility working
3. ✅ API integration complete
4. ✅ Error handling working
5. ✅ Authorization working
6. Ready for **production deployment** ✅

---

## 📞 Troubleshooting

### Problem: Publish button doesn't work
**Solution**: 
- Check browser console for errors
- Verify backend server is running
- Check network requests in DevTools

### Problem: Student can see draft courses
**Solution**:
- Refresh page
- Check StudentDashboard.js filtering code
- Verify course status in database

### Problem: Old token issues
**Solution**:
- Clear localStorage: `localStorage.clear()`
- Logout and login again
- Clear browser cookies

### Problem: 403 Forbidden when publishing
**Solution**:
- Verify you're logged in as course creator
- Check token is valid
- Don't try other teacher's courses

---

**Last Updated**: April 2, 2026
**Status**: All components integrated and ready for testing
