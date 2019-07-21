# CS350_491
This is the a project for CS 350/491. It will be a continual project. 

Project 1 requirements:
```
Project 1. 

Due June 21, Friday (midnight). 
This first (warm-up) project requires you to develop your personal homepage (future projects will be based on this one by incrementally adding and enriching contents, styles, and functions.). Specific requirements are as follows:
1. You must use a plain text editor such as Windows notepad, WordPad, etc. and produce “clean” web pages (more generally referred to as web documents), i.e., without any unintended tags/contents that are typically automatically generated and added to the source files of your webpage if you use a non-plain editor such as MS Word (in other words, do not use MS Word and the like to edit and then save as web pages – that’s
cheating and can be very easily identified). This requirement applies to this and all future projects of this course.
2. Follow the coding standard and conventions introduced in chapter 2.
3. Your home page shall include the following contents accordingly formulated using suitable HTML tags and CSS style files (via an external CSS file): A sketchy bio of you, one profile image of you (using <figure> with embedded <img> tag), one (or more) of your favorite mottos (using <blockquote>, <q>, <cite> at your choice), a list of your photos (e.g., taken from a recent trip to some interesting place) (Here is example code for a single photo link:
 <a href="../html-link.htm">
   <img src="flower.jpg" width="82" height="86" title="White flower" alt="Flower">
 </a>)
4. You must use these organizational tags: section, article, aside, nav (could be used for your photo list), header, footer.
5. You are encouraged to use as many tags so far covered by the posted slides as you like (At the beginning of each set of posted slides there is an outline of the covered tags) and go beyond my above requirement (which is the minimum). But you are discouraged to use other tags we have not addressed (to be reserved for next project) even though you may already be familiar with.
6. Submit your project (all files) as a single zipped file in the corresponding assignment folder at D2L (our course’s website) before the due time.
7. Note: the integrity of your multiple files especially the embedded links must be carefully maintained (broken links will cause you to lose points when I download and test your project).
```

Project 2 requirements:
```
Project 2. Due July 1, Monday (midnight). Based/continuing on Project 1, add the following features and elements:
1. Add a table with daily (roughly by hours) or weekly (by days) schedule (whichever makes the most sense with regard to your actual situation for the summer). Try to use a bigger variety (if not all) of table related tags and features.
2. Use layout tables (which mimic tables but are not real tables) to rearrange your travel photos (can use slide 16 of Chapt5 as a sample).
3. Add your favorite music audio and video clips (addressed in Chapt7).
4. Add a feedback form soliciting visitor’s comments and signing in contact book. You shall use a variety of form widgets (most of them are addressed in Chapt8) gathering visitor information such as name, address, phone, email, and comments, etc. using suitable form elements, verify the validity of user input instantly using client-side JavaScript event handlers (also addressed in Chapt8), and send a “Thank You” replay email upon form submission (no server-side coding required for this project).
5. Accordingly enrich your CSS styles (maintain the externa CSS file, while some style elements may be handily put inline of the html files).
6. Submission requirement (Must Be Rigidly Followed): Name your project 2 folder as Project2, have all your project files located in it (can have subfolders), name your main webpage file as “index.htm”, change to the upper (parent) folder, zip the whole folder “Project2” (including all subfolders if any), rename your zipped (single) file as “last_name-first_name.Project2.zip” such as mine “Che-Daren-Project2.zip”, upload to the submission folder at course’s website.
7. Grading scale: get 80% if basic (explicitly described) requirements are met; the remaining 20% is at the instructor’s discretion according to professionalism, aesthetic, and the implied effort (These are hard to be put in a specific requirement).
8. Tips to get maximum score: Think in a professional way, do a little more than the basic requirement, be thoughtful and creative. Maximally satisfy/please the potential users/ visitors (to your webpage) – I am one of them.
```

Project 3 requirements:
```
1. Further improve your project 2 using the new mechanisms and skills addressed since Project 2 (i.e., chapter 9 
  to chapter 12), especially on the layout and the overall looks of your pages. You may consider splitting your 
  index page into multiple pages (like many of you had already done with Project2), leaving the main (index) page 
  as the entry/portal page with a general introduction and links well organized (e.g., in a sidebar) that point to 
  other content pages.
2. Enhance the validity check of user input to the feedback form you already did with Project 2: set and enforce 
  required entries, and particularly verify the format of email and phone number (e.g., 618-453-6011) to make sure 
  they are valid email address and phone number.
3. Add a really fun element to your home page: shape transformation game. Initially, preset a canvas (Chapter 12) 
  element as a hidden place holder (without taking any visual space).Upon a user clicks on the button, a boxed 
  canvas area (nicely fit into your page’s overall layout) shows up with an instruction displayed inside: e.g., 
  “Please click on 5 arbitrary spots within this box, and see my shape transformation magic to happen.” Behind the 
  scene, you will need to use JavaScript to locate the five points the user clicked on, randomly select five shapes 
  (e.g., from the list of rectangle, square, circle, oval, triangle, line) and center them each around one of the 
  five points, with a random color (selected from the list of 7 common colors: red, orange, yellow, green, cyan, 
  blue, purple) for both the shapes and the filling (of a closed shape). The dimensions of the shapes shall be 
  randomly set, too, from the range of 1/6 to 1/2 of the width of the canvas’ area. Keep the above process repeat in 
  a pace so that the user will be able to observe the shapes’ random changing/transforming/alternation (in position, 
  shape, color, and size, etc.). The repeated transformation shall be stopped/reset if the user clicks on anywhere 
  in transformer canvas. (Hint: you will need to use event.clientX and event.clientY to get the coordinates of the 
  five points within the canvas clicked on by the user; you may need to give a pause within the loop to avoid the 
  shapes transforming too fast for human vision to discern. Notice that I only made a very basic description of the 
  shape transformation game; it is up to you to tap your creativity and make the game a real fun.)
 ```

Project 4 requirements:
```
1. Set up your own Node.js web server, and upload and link all your project files of Project 3 to your Node web server. 
   Now you have both client side and server side; make sure both sides work and collaborate -- your project runs in a 
   client/server manner (not simply a local html file presented in a web browser as before).
2. Rework on the   (described in Project 2): upon submission, store the form data in a data file on the server, and send 
   a real email “thank you” message to the user.
3. Host your project website on a real (public accessible) server (not your computer) so that I (and anyone) can visit 
   your Project 4. Search Google for “best free node.js hosting”, you will find a lot free hosting services and pick up 
   your favored one.
```



Steps to push to Heroku:
1. `heroku login` in CLI.
1. `git push heroku master` in CLI.
