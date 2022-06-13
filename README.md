# Chess AI by Tomás Barbosa

This is a Chess engine created with the help of the libraries chess.js and chessboard.js, which help with the chess logic, like telling me what moves are allowed in a certain positions and that sort of stuff. The project isn't finished yet, in fact I suspect it will take quite a long time until I am satisfied with the result, but I think it's already an interesting project.

I will share here a link where you can play against the engine and a couple screenshots of how it works, after that, there will be a bit of a "roadmap" explaining my thought processes and the paths I took to implement this bot.

link to play the engine: https://barbosachessai.netlify.app/

**MAIN IMPLEMENTATION**

this is the chessboard you will see when you open the link right now, at the moment it's only possible to play as white, even tho the bot does know how to play white as well, he logic for allowing the user to chose still has to be implemented nd I thought I wanted to keep it simple for the MVP.

![Screenshot 2022-06-13 at 22 29 35](https://user-images.githubusercontent.com/81977215/173439773-bfbaaa3a-551b-4ce1-93cf-c01cf9b7b406.png)

You will see that as you play, the move history will be shown below the board, so that it's easier for you to review the game afterwards if you want to.

![Screenshot 2022-06-13 at 22 31 37](https://user-images.githubusercontent.com/81977215/173440064-c94da737-2fbd-4cce-bf76-fa9f8e2322ba.png)

**BOT TRAINING**

outside of this site where you can play, you'll see that right now the project has a second branch, that branch is being used to train the bot right now, you can read below on how the "practice" works, but the whole point is bascially to have another envornment where I can let the AI practice and add all kinds of features I need before sending the new smarter bot to the main branch.


![Screenshot 2022-06-13 at 22 36 12](https://user-images.githubusercontent.com/81977215/173440846-c7e3ef82-a0f9-4177-972d-4013d1efb29c.png)

As you can see it looks fairly similairly, but with 2 extra buttons, one of them just resets the board, this is for me to be able to test stuff faster since this version isn't online it shouldn't bother anyone, the first button is the more interesting one though, it reads "let the bot practice" and what it does is it lets the bot play against himself on loop, so that he can learn from his own games, in order for me to be able to see if that is working I added some console logs, since the moves aren't played on the board (why would they be?), this is what it looks like:

 ![Screenshot 2022-06-13 at 22 44 46](https://user-images.githubusercontent.com/81977215/173442153-5864c21c-05cc-4863-ab4a-2d3ae93c3427.png)
 
 and the data is from this games is in localstorage:
 
 ![Screenshot 2022-06-13 at 22 45 59](https://user-images.githubusercontent.com/81977215/173442321-b3a1cda7-cdb9-47ab-b023-4de6546d499f.png)


