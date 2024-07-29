# Pose Estimation

Este proyecto de Angular es parte del proyecto de tesis de Estimación de Pose.

## Table of contents

- [Pose Estimation](#pose-estimation)
	- [Table of contents](#table-of-contents)
	- [Required](#required)
	- [Instalation](#instalation)
	- [Uso](#uso)

## Required

Next technologic tools are necessary:

- Node.js
- PNPM

And must have an acount created in:

- Cloudinary
- Firebase

## Instalation

Follow the steps below to dowload the proyecto from GitHub:

1. Clone the repository:

```bash
git clone https://github.com/tu-usuario/tu-proyecto-angular.git
```

2. Navigate to the project directory:

```bash
cd tu-proyecto-angular
```

3. Enable PNPM:

```bash
corepack enable pnpm
```

4. Install dependencies:

```bash
pnpm install
```

5. In Firebase Firestore, create a collection named `doctors` and create a record with the same properties as the `DoctorData` data type found in the file `doctor.type.ts` inside the `types` folder in the `src` folder of the project. And, in the `role` property insert `admin`. `Email` value must be `@ug.edu.ec`.

6. Make a copy of the `.env.example` file and name it as `.env` and replace the data with the corresponding data.

7. The `VITE_POSE_ESTIMATION_API` value is the Python API, must have the Python project executing.

## Uso

To execute the application, after installing dependencies, execute next command:

```bash
pnpm dev
```

If you want to expose application server to use it in another devices in the same network, execute:

```bash
pnpm dev --host
```
