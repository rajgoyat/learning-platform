# Course Publishing System - Visual Architecture

## 🏗️ Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    COURSE PUBLISHING API                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │    Protected Middleware     │
                │   (JWT Token Validation)    │
                └────────────────┬────────────┘
                                 │
        ┌────────────┬───────────┼───────────┬────────────┐
        │            │           │           │            │
        ▼            ▼           ▼           ▼            ▼
    ┌─────┐    ┌─────────┐ ┌───────┐  ┌─────────┐   ┌──────┐
    │POST │    │  PATCH  │ │  PUT  │  │  GET    │   │DELETE│
    │     │    │         │ │       │  │         │   │      │
    │ :/ │    │ /:id    │ │:id/pb │  │various  │   │ :id  │
    └─────┘    └─────────┘ └───────┘  └─────────┘   └──────┘
      │            │           │          │            │
      ▼            ▼           ▼          ▼            ▼
   CREATE      UPDATE     PUBLISH      RETRIEVE      DELETE
   COURSE      COURSE     COURSE       COURSES       COURSE
      │            │           │          │            │
      └────────────┼───────────┼──────────┼────────────┘
                   │           │          │
                   ▼           ▼          ▼
              ┌─────────────────────────────────┐
              │   Course Controller Functions   │
              │  - createCourse()               │
              │  - updateCourse() [NEW]         │
              │  - publishCourse() [NEW]        │
              │  - getAllCourses()              │
              │  - getTeacherCourses()          │
              │  - getCourseById()              │
              │  - deleteCourse()               │
              └────────────────┬────────────────┘
                               │
                               ▼
                ┌─────────────────────────────┐
                │   MongoDB Database Query    │
                │  - Validation               │
                │  - Authorization Check     │
                │  - CRUD Operations         │
                └────────────────┬────────────┘
                                 │
                                 ▼
                ┌─────────────────────────────┐
                │   Course Collection (DB)    │
                │  - title (required)         │
                │  - description (required)   │
                │  - concept (required)       │
                │  - contentType              │
                │  - videoUrl                 │
                │  - teacher (ObjectId)       │
                │  - status (Draft/Active)    │
                │  - modules                  │
                │  - timestamps               │
                └─────────────────────────────┘
```

---

## 📊 Course Status Lifecycle

```
START
  │
  ▼
┌──────────────────────────────────────┐
│  POST /api/courses                   │
│  Status: Draft (default)             │
│  Visibility: Teacher only            │
└────────────┬─────────────────────────┘
             │
             ├─────────┬─────────┐
             │         │         │
             ▼         ▼         ▼
        ┌────────┐ ┌────────┐ ┌────────┐
        │EDIT    │ │EDIT    │ │DELETE  │
        │PATCH   │ │PATCH   │ │        │
        │:id     │ │:id     │ │:id     │
        └────────┘ └────────┘ └────────┘
             │         │         │
             └────┬────┘         │
                  │              │
                  ▼              │
        ┌──────────────────┐    │
        │Still in DRAFT    │    │
        │(Can edit again)  │    │
        └────────┬─────────┘    │
                 │              │
                 ▼              │
        ┌──────────────────┐    │
        │PUT /api/courses  │    │
        │    :id/publish   │    │
        │                  │    │
        │Validate & Ready  │    │
        └────────┬─────────┘    │
                 │              │
                 ▼              │
        ┌──────────────────┐    │
        │  Status: Active  │    │
        │  Visibility:     │    │
        │  All Students    │    │
        └────────┬─────────┘    │
                 │              │
                 ├──────┬───────┤
                 │      │       │
                 ▼      ▼       ▼
            ┌─────┐┌────────┐┌────────┐
            │EDIT │ │EDIT   ││DELETE  │
            │PATCH││ PATCH ││        │
            │:id  ││:id    ││:id     │
            └─────┘└────────┘└────────┘
                 │      │       │
                 └──┬───┘       │
                    │          │
            ┌───────┴────────┐ │
            │                │ │
            ▼                ▼ ▼
       ┌────────────┐   ┌────────┐
       │Can revert  │   │DELETE  │
       │to DRAFT    │   │COURSE  │
       └────────────┘   └────────┘
            │               │
            ▼               ▼
          END             END
```

---

## 🔀 Request Flow Example: Publishing a Course

```
TEACHER CLIENT                    BACKEND SERVER              MONGODB
      │                                 │                      │
      │  1. POST /courses (Draft)       │                      │
      ├────────────────────────────────>│                      │
      │     {                           │                      │
      │       title: "React"            │                      │
      │       description: "..."        │                      │
      │       concept: "..."            │   2. Validate       │
      │       status: "Draft"           │      & Create       │
      │     }                           ├─────────────────────>│
      │                                 │                      │
      │                                 │      3. Insert      │
      │                                 │      into DB        │
      │                                 │<─────────────────────┤
      │                                 │                      │
      │  4. Course Created              │                      │
      │  (Draft, ID: 123456)            │                      │
      │<────────────────────────────────┤                      │
      │                                 │                      │
      │  5. PATCH /courses/123456       │                      │
      ├────────────────────────────────>│                      │
      │     {                           │                      │
      │       modules: 10              │   6. Validate       │
      │     }                           │      & Update      │
      │                                 ├─────────────────────>│
      │                                 │                      │
      │                                 │      7. Update      │
      │                                 │      in DB         │
      │                                 │<─────────────────────┤
      │  8. Course Updated              │                      │
      │<────────────────────────────────┤                      │
      │                                 │                      │
      │  9. PUT /courses/123456/publish │                      │
      ├────────────────────────────────>│                      │
      │                                 │   10. Validate      │
      │                                 │       Fields        │
      │                                 │       & Publish    │
      │                                 ├─────────────────────>│
      │                                 │                      │
      │                                 │    11. Update       │
      │                                 │    Status:Active    │
      │                                 │<─────────────────────┤
      │ 12. Published! Status: Active   │                      │
      │<────────────────────────────────┤                      │
      │                                 │                      │
      │  Now visible to students        │                      │
```

---

## 🔐 Authorization Matrix

```
┌───────────────────────────────────────────────┐
│         COURSE ACCESS CONTROL                 │
├───────────┬──────────┬──────────┬─────────────┤
│ Action    │ Student  │ Teacher  │ Other Tch.  │
├───────────┼──────────┼──────────┼─────────────┤
│ View      │          │          │             │
│ Published │    ✅    │    ✅    │      ✅     │
├───────────┼──────────┼──────────┼─────────────┤
│ View      │          │          │             │
│ Draft     │    ❌    │  ✅ own  │      ❌     │
├───────────┼──────────┼──────────┼─────────────┤
│ Create    │    ❌    │    ✅    │      ✅     │
├───────────┼──────────┼──────────┼─────────────┤
│ Update    │    ❌    │  ✅ own  │      ❌     │
├───────────┼──────────┼──────────┼─────────────┤
│ Publish   │    ❌    │  ✅ own  │      ❌     │
├───────────┼──────────┼──────────┼─────────────┤
│ Delete    │    ❌    │  ✅ own  │      ❌     │
└───────────┴──────────┴──────────┴─────────────┘
```

---

## 💾 Data Flow: Course Information

```
┌─────────────────────────────────────────┐
│         Create Request (POST)            │
│  {                                       │
│    title: "Machine Learning"             │
│    description: "Complete ML Guide"      │
│    concept: "Algorithms & Theory"        │
│    contentType: "Video"                  │
│    videoUrl: "https://..."               │
│    modules: 5                            │
│    status: "Draft"                       │
│  }                                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  validateInputs()  │
        │  - Check required  │
        │  - Sanitize text   │
        │  - Validate enums  │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ checkTeacherRole() │
        │ - Get user from DB │
        │ - Verify teacher   │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  MongoDB.insert()  │
        │ Stored Document:   │
        │ {                  │
        │  _id: ObjectId     │
        │  title: "..."      │
        │  teacher: UserId   │
        │  status: "Draft"   │
        │  createdAt: Date   │
        │  updatedAt: Date   │
        │ }                  │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  buildPayload()    │
        │  Format response   │
        │  data for client   │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  {                 │
        │    success: true   │
        │    course: {...}   │
        │  }                 │
        └────────────────────┘
```

---

## 🎯 Error Handling Flow

```
        ┌─────────────────────┐
        │  API Request IN     │
        └──────────┬──────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Token Validation ❓  │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │ ❌ Invalid?         │  ✅ Valid?
        ▼                     ▼
    [401]               ┌──────────────┐
  Unauthorized         │User check ❓  │
                       └────────┬──────┘
                                │
                      ┌─────────┴─────────┐
                      │ ❌ Not found?    │ ✅ Found?
                      ▼                  ▼
                  [404] Not Found  ┌────────────────────┐
                                   │Coursecheck ❓      │
                                   └────────┬───────────┘
                                            │
                                ┌───────────┴────────────┐
        ┌───────┘ ❌ Not Found?                  ✅ Found?
        │                                        ▼
        │                                   ┌──────────────┐
        │                                   │Owner check ❓│
        │                                   └────────┬─────┘
        │                                            │
        │                              ┌─────────────┴───────────┐
        │                   ❌ Not Owner?          ✅ Is Owner?
        │                   ▼                       ▼
    [404]              [403]               ┌─────────────────┐
  Not Found        Forbidden              │Process Request  │
                                           └────────┬────────┘
                                                    │
                                        ┌───────────┴────────────┐
                                        │                        │
                                        ▼                        ▼
                                    [200/201]               [400] Error
                                    Success                Bad Request
```

---

## 📈 Performance Considerations

```
REQUEST PROCESSING TIME

Endpoint: PATCH /courses/:id
└─ Authorization Check      [~5ms]
└─ Database Query (Find)    [~10ms]
└─ Ownership Validation     [~2ms]
└─ Input Validation         [~5ms]
└─ Database Update          [~15ms]
└─ Response Building        [~2ms]
└─ Network Transmission     [~20ms]
   ─────────────────────────────
   Total Average Time: ~60ms

Indexes Recommended:
- teacher: ObjectId (for finding teacher's courses)
- status: String (for filtering by status)
- createdAt: Date (for sorting)
```

---

## 🔗 Related Systems

```
┌──────────────┐
│   Frontend   │
│   (React)    │
└──────┬───────┘
       │ HTTP REST
       ▼
┌──────────────────┐
│   Express API    │
│   Server         │
└──────┬───────────┘
       │ Mongoose ODM
       ▼
┌──────────────────┐
│   MongoDB        │
│   Atlas          │
└──────────────────┘

       ↓

┌──────────────────┐
│  AuthContext     │
│  (Token Mgmt)    │
└──────┬───────────┘
       │ JWT Bearer Token
       ▼
┌──────────────────┐
│  Auth Middleware │
│  (Verification)  │
└──────────────────┘

       ↓

┌──────────────────┐
│  Course Model    │
│  & Controller    │
└──────┬───────────┘
       │ CRUD Operations
       ▼
┌──────────────────┐
│  Database Layer  │
│  (MongoDB Query) │
└──────────────────┘
```

---

## ✅ Verification Checklist

Current Implementation Status:

```
Backend Components:
[✅] Course Model - Updated with status enum & default Draft
[✅] Controller Functions - updateCourse() & publishCourse()
[✅] API Routes - PATCH and PUT endpoints
[✅] Error Handling - Comprehensive validation
[✅] Authorization - Owner checking
[✅] Input Sanitization - Text trimming

API Endpoints:
[✅] POST   /api/courses              - Create
[✅] GET    /api/courses              - List all
[✅] GET    /api/courses/mine         - Get my courses
[✅] GET    /api/courses/:id          - Get details
[✅] PATCH  /api/courses/:id          - Update [NEW]
[✅] PUT    /api/courses/:id/publish  - Publish [NEW]
[✅] DELETE /api/courses/:id          - Delete

Frontend Implementation Needed:
[⏳] Update TeacherDashboard.js to use Draft status
[⏳] Add Update course handler (PATCH)
[⏳] Add Publish course button
[⏳] Add Edit course modal
[⏳] Add Status badge display
[⏳] Test all workflows
```

---

**Architecture Version**: 2.0  
**Last Updated**: April 2, 2026  
**Status**: Backend Complete, Frontend Integration Pending
