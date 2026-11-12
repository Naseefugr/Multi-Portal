# Components Registry & Standards (`Components.md`)

This file is the single source of truth for all reusable UI components in the **Portal** project.

---

## 1. Component Reuse Protocol

> [!IMPORTANT]
> **Check Before You Build:**
> 1. Always inspect this document **before** building any new UI component.
> 2. If a reusable component already exists for your use case, **you must use it**.
> 3. If a component does not exist, build it according to [`design.md`](file:///d:/Buildathon/Portal/design.md) and [`Agent.md`](file:///d:/Buildathon/Portal/Agent.md), and immediately **register it in this file**.

---

## 2. Core Reusable Component Registry

### Summary of Registered Components

| Component | Path | Description | Key Props / Variants |
| :--- | :--- | :--- | :--- |
| **`Modal`** | `src/components/common/Modal.tsx` | Base popup dialog for overlays, Create & Edit forms | `isOpen`, `onClose`, `title`, `children`, `footer` |
| **`DeleteConfirmModal`** | `src/components/common/DeleteConfirmModal.tsx` | Standardized delete confirmation popup | `isOpen`, `onClose`, `onConfirm`, `itemName`, `isLoading` |
| **`FlatCard`** | `src/components/common/FlatCard.tsx` | Single-level flattened card surface (no nesting) | `title`, `actions`, `badge`, `children`, `footer` |
| **`Button`** | `src/components/common/Button.tsx` | Core button component | `variant` (`primary` \| `secondary` \| `danger` \| `ghost`), `size`, `isLoading` |
| **`InputField`** | `src/components/common/InputField.tsx` | Clean input component without redundant text | `label`, `error`, `type`, `value`, `onChange` |
| **`SignInModal`** | `src/components/common/SignInModal.tsx` | Secure account login modal without demo bypass links | `isOpen`, `onClose`, `onOpenRegister` |

---

## 3. Component Details & Reference Specifications

### 3.1 `Modal` (Base Popup Modal)
- **Path:** `src/components/common/Modal.tsx`
- **Purpose:** Foundation for all Create and Edit forms, as well as general modal dialogues. Ensures proper backdrop, escape key support, and focus management.
- **Props Interface:**
  ```typescript
  interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  }
  ```
- **Usage Example:**
  ```tsx
  <Modal
    isOpen={isEditOpen}
    onClose={() => setIsEditOpen(false)}
    title="Edit Item"
    footer={
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setIsEditOpen(false)}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </div>
    }
  >
    <ItemForm initialData={item} onSubmit={handleSave} />
  </Modal>
  ```

---

### 3.2 `DeleteConfirmModal` (Delete Confirmation)
- **Path:** `src/components/common/DeleteConfirmModal.tsx`
- **Purpose:** Dedicated safety modal for all delete / destructive actions. Displays target item name and confirms intent.
- **Props Interface:**
  ```typescript
  interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    itemName?: string;
    title?: string;
    description?: string;
    isLoading?: boolean;
  }
  ```
- **Usage Example:**
  ```tsx
  <DeleteConfirmModal
    isOpen={isDeleteOpen}
    onClose={() => setIsDeleteOpen(false)}
    onConfirm={handleDelete}
    itemName={project.name}
    isLoading={isDeleting}
  />
  ```

---

### 3.3 `FlatCard` (Flattened Card)
- **Path:** `src/components/common/FlatCard.tsx`
- **Purpose:** Single-level surface for content and dashboards. Strict compliance with the "no nested cards" rule.
- **Props Interface:**
  ```typescript
  interface FlatCardProps {
    title?: React.ReactNode;
    badge?: React.ReactNode;
    actions?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }
  ```
- **Usage Example:**
  ```tsx
  <FlatCard
    title="Project Gamma"
    badge={<span className="badge">Active</span>}
    actions={
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={openEditModal}>Edit</Button>
        <Button variant="danger" size="sm" onClick={openDeleteModal}>Delete</Button>
      </div>
    }
  >
    <div className="text-sm">Team: Core Infrastructure</div>
  </FlatCard>
  ```

---

### 3.4 `Button`
- **Path:** `src/components/common/Button.tsx`
- **Purpose:** Standardized button element supporting primary, secondary, danger, and ghost styles.
- **Props Interface:**
  ```typescript
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
  }
  ```

---

### 3.5 `InputField`
- **Path:** `src/components/common/InputField.tsx`
- **Purpose:** Clean, accessible input field with an essential label and inline error messaging, avoiding redundant descriptive labels.
- **Props Interface:**
  ```typescript
  interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
  }
  ```

---

### 3.6 `SignInModal`
- **Path:** `src/components/common/SignInModal.tsx`
- **Purpose:** Secure authentication popup modal for signing into institution accounts without exposed demo lists or quick bypasses.
- **Props Interface:**
  ```typescript
  interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRegister: () => void;
  }
  ```
- **Usage Example:**
  ```tsx
  <SignInModal
    isOpen={isSignInOpen}
    onClose={() => setIsSignInOpen(false)}
    onOpenRegister={() => setIsRegisterOpen(true)}
  />
  ```

---

## 4. Registration Guide for New Components

Whenever a new reusable component is created:
1. Ensure it does **not** duplicate an existing component above.
2. Confirm it adheres to flat card standards and concise copy rules from [`design.md`](file:///d:/Buildathon/Portal/design.md).
3. Append a new section to this file with:
   - Component Name and File Path
   - Purpose
   - TypeScript Props Interface
   - Minimal Usage Example
