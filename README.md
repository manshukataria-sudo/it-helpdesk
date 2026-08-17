                ┌──────────────┐
                │   Next.js    │
                │  Frontend    │
                └──────┬───────┘
                       │ REST API
                       ↓
                ┌──────────────┐
                │   Express    │
                │    API       │
                └──────┬───────┘
                       │
              ┌────────┴────────┐
              ↓                 ↓
        JWT / RBAC          Controllers
                                │
                                ↓
                           Mongoose
                                │
                                ↓
                         MongoDB Atlas