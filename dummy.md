Section One 
step 1. if the challenge is not  finished then the user clicks the invite friends button such that the /share page is rendered or navigated to 
step 2. when the user clicks on the share button the /share component displays 
step 3. the /share component will have something like a preview where user can see how the preview (something missing is the how will preview link knows what social media platform the user has selected) appears with the alert function in JS 
step 4. It will also have all the relevant social media links that the user can share the content to

Section Two 
step 1 Example a user clicks on the share with facebook button 
step 2.  the user is directed to the facebook page 
step 3. when a random user clicks on the share link then the user is directed to the 8by8 page 
step 4. the 8by8 page is the homepage with a "GET STARTED BUTTON" where the user can sign up and doo all the stuff 

notes 
looks like the useRef behaves differently than useState because it doesn't rerender the page when the value is changed. 


you don't need to hit the api for the random userID data instead u need to just retrive that data from the userID supabase which is already ppresnt from this dir services/auth/auth.ts


actually this is for when the user copies the id I need to push this into the supabase file from subabase-user-repository.ts   (also remember to go to the supabase dir)

tips read through the docs -- understand design patterns, not system design lol 


if the user shares then hit the API
if the user copies the link and shares 


// get the api req to go fromm 500 --> 200 
// handle the issue when the user clicks the copy button to many times 
// write tests to mock the router so that all the unit tests pass 