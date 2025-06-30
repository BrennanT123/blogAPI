**Blog API**

This is a simple api I made for blogs. It uses express for the backend and react for the frontend.  The repo includes the api inside the backend folder and an example use case inside the blog1 folder. The backend uses JWT for authentication and prisma to manage the postgres db. 

The blog allows the blog owner to make posts and allows other users to make comments on the post either using an account or as a guest. The blog owner can also edit their posts, delete their posts, and hide posts from the published page. Owner routes are protected using JWT authentication and inputes are validated using express-validator. 

test credentials for blog owner:

email: blogOwner@fakeemail.com
password: :,"4zTMW^"v3gsL
