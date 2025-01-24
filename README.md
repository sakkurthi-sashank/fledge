# Fledge  
Fledge is a modern e-learning platform that allows students and educators to view, create, and manage courses seamlessly while providing learners with an intuitive and engaging learning experience.

## Tech Stack  
- **Next.js**
- **Prisma**
- **Postgres**
- **TailwindCSS**
- **Stripe**
- **Uploadthing**  
- **MUX**
- **Google OAuth**

---

## Platform Pages  

### Login Page  
![Login Page](https://github.com/user-attachments/assets/93dadc37-a751-4a32-ac59-e611222e6b25)  
The entry point for users to log in using their credentials or Google OAuth for secure access to the platform.  

### Home Page  
![Home Page](https://github.com/user-attachments/assets/44db5e40-784e-461a-9635-9311b92e7ccf)  
A dashboard where users can navigate the platform, access courses, and view personalized content.  

### Create Course Page  
![Create Course Page](https://github.com/user-attachments/assets/14911043-10e3-48cf-8217-08cf159df671)  
Allows instructors to create new courses by providing details such as title, description, and cover image.  

### View All Courses Page  
![View All Courses Page](https://github.com/user-attachments/assets/b19a82c4-632f-499b-999f-9249847d0017)  
Displays a list of all available courses with filtering and search capabilities for easy navigation.  

### Update Course Page  
![Update Course Page](https://github.com/user-attachments/assets/e69f8094-ceb6-44ca-8377-31dfa8a3bc68)  
Enables instructors to edit course information such as title, description, and other relevant details.  

### Create Section Page  
![Create Section Page](https://github.com/user-attachments/assets/c1730610-a1ee-4dc6-a56e-5ab17806df21)  
Facilitates the addition of new sections within a course, including uploading videos and creating quizzes.  

### Update Section Page  
![Update Section Page](https://github.com/user-attachments/assets/d355335c-e84e-4c2e-80ee-c4e201178681)  
Allows instructors to update specific sections of a course with updated content and materials.  

### Update Section Page (Alternate View)  
![Update Section Page - Alternate View](https://github.com/user-attachments/assets/bc83f62c-a55a-4718-98c7-e429fe57fa11)  
An alternate view of the section update page showing additional options for editing content.  

### View Course Page  
![View Course Page](https://github.com/user-attachments/assets/1deb5273-7bda-4b3e-bbb4-35c0a1eff1fc)  
Enables learners to view course content, including videos, resources, and progress tracking.  

### Performance Page  
![Performance Page](https://github.com/user-attachments/assets/29021435-2023-4181-9a1f-f1bbb3ad3261)  
Provides insights into student performance, including course progress and quiz results.  

## Installation  

1. Clone the repository:  
  ```
  git clone https://github.com/sakkurthi-sashank/fledge.git
  cd fledge
   ```

2. Install dependencies:
    ```
    pnpm install
   ```
3. Configure environment variables in a .env file:
  ```
  DATABASE_URL=your_postgres_url  
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key  
  STRIPE_SECRET_KEY=your_stripe_secret_key  
  NEXTAUTH_URL=your_deployment_url  
  GOOGLE_CLIENT_ID=your_google_client_id  
  GOOGLE_CLIENT_SECRET=your_google_client_secret  
  UPLOADTHING_API_KEY=your_uploadthing_key  
  MUX_TOKEN_ID=your_mux_token_id  
  MUX_TOKEN_SECRET=your_mux_token_secret  
  ```
4. Run database migrations:
  ```
  npx prisma db push
  ```

5. Start the development server:
  ```
  pnpm run dev
  ```
