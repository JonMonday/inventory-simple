# Permission System

The permission system uses a **Single Source of Truth** located at `/shared/permissions.json`.

## How to Add or Modify Permissions

1.  **Edit the JSON**:
    Open `/shared/permissions.json` and add your new permission object:
    ```json
    { "key": "new.feature.action", "group": "FeatureName", "label": "Description" }
    ```

2.  **Generate Types**:
    Run the generation script to update frontend and backend type definitions:
    ```bash
    npm run generate:permissions
    ```
    (You can run this from root, frontend, or backend directories if configured, or `node scripts/generate-permissions.mjs` directly).

3.  **Seed the Database**:
    Update the database to include the new permission metadata:
    ```bash
    cd backend
    npx prisma db seed
    ```

## Architecture
- **Source**: `shared/permissions.json`
- **Generator**: `scripts/generate-permissions.mjs`
- **Outputs**: 
  - `backend/src/common/auth/permissions.generated.ts`
  - `frontend/permissions/permissions.generated.ts`
- **Database**: Permissions are seeded into the `permissions` table using the `key` as the unique identifier.
