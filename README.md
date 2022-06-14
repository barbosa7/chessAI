# Chess AI by Tomás Barbosa

This is a Chess engine created with the help of the libraries chess.js and chessboard.js, which help with the chess logic, like telling me what moves are allowed in a certain position and that sort of stuff. The project isn't finished yet; in fact I suspect it will take quite a long time until I am satisfied with the result, but I think it's already an interesting project.

I will share here a link where you can play against the engine and a couple screenshots of how it works;  after that, there will be a bit of a "roadmap" explaining my thought processes and the paths I took to implement this bot.

link to play the engine: https://barbosachessai.netlify.app/

**MAIN IMPLEMENTATION**

this is the chessboard you will see when you open the link right now, at the moment it's only possible to play as white, even though the bot does know how to play white as well, he logic for allowing the user to chose still has to be implemented and I thought I wanted to keep it simple for the MVP.

![Screenshot 2022-06-13 at 22 29 35](https://user-images.githubusercontent.com/81977215/173439773-bfbaaa3a-551b-4ce1-93cf-c01cf9b7b406.png)

You will see that as you play, the move history will be shown below the board, so that it's easier for you to review the game afterwards if you want to.

![Screenshot 2022-06-13 at 22 31 37](https://user-images.githubusercontent.com/81977215/173440064-c94da737-2fbd-4cce-bf76-fa9f8e2322ba.png)

**BOT TRAINING**

outside of this site where you can play, you'll see that right now the project has a second branch. That branch is being used to train the bot right now, you can read below on how the "practice" works, but the whole point is bascially to have another environment where I can let the AI practice and add all kinds of features I need before sending the new smarter bot to the main branch.


![Screenshot 2022-06-13 at 22 36 12](https://user-images.githubusercontent.com/81977215/173440846-c7e3ef82-a0f9-4177-972d-4013d1efb29c.png)

As you can see it looks fairly similarly, but with 2 extra buttons, one of them just resets the board. This is for me to be able to test stuff faster since this version isn't online it shouldn't bother anyone, the first button is the more interesting one though, it reads "let the bot practice" and what it does is it lets the bot play against himself on loop, so that he can learn from his own games, in order for me to be able to see if that is working I added some console logs, since the moves aren't played on the board (why would they be?), this is what it looks like:

 ![Screenshot 2022-06-13 at 22 44 46](https://user-images.githubusercontent.com/81977215/173442153-5864c21c-05cc-4863-ab4a-2d3ae93c3427.png)
 
 and the data from these games is in local storage:
 
 ![Screenshot 2022-06-13 at 22 45 59](https://user-images.githubusercontent.com/81977215/173442321-b3a1cda7-cdb9-47ab-b023-4de6546d499f.png)

## Implementation history

this is going to be a more technical file of the readme file, detailing how I'm going about programming this bot. I'll do my best to keep it easy to understand but it's probably going to be a bit heavier (this is your queue to go get your coffee if you haven't had one).

After reading a bit about how the libraries work etc. the first step was obviously to implement a logic for the bot to follow, in order to know what moves to take, easier said than done, of course.

Anyone who has ever played chess knows that a good player has to calculate a bit, for each move, what consequences will it have, "if I play this, what will my opponent play afterwards and what will I do next... Will I win this exchange? etc." we are talking about a bot here, so the best way to do this is for the engine to look at every possible play he can make, for each of those moves see what moves the opponent have, assume he will make the best one and so on, this begs the question, how far into the future do we look? 2 moves ahead? 4? 30? The higher the number we choose the better the bot will play, yet it will be exponentially slower, since it has to look at a lot more moves.

```js 
  for (var i=1; i<moves.length; i++) {
        
        chessgame.ugly_move(moves[i]);
        temp = calcinadvance(2,chessgame,-9999,99999,true);
        chessgame.undo();
        if (temp >= pos) {
            topmove = moves[i];
            pos=temp;
        }
    }
    if (pos<=0){
        return (moves[Math.floor(Math.random() * moves.length)])
    }
    
```
    
this is the algorithm we use for that, we will get into the -9999 and ythe 9999 later, for now it's only important to understand that "calcinadvance" does what I explained before, it recursively calculates all the possible moves. The first parameter is the depth (we are using 2 right now, but plan to use a higher depth later once the algorithm is more optimized and runs faster. the last parameter is a boolean that tells the function which player is playing.

With this method we are able to basically look into the future for a number of moves, but when we reach depth 0 we still have to be able to evaluate the position. This is the key part, and arguably the hardest one to implement, how will the bot look at a position and know if it's good or bad ( and how good vs. how bad?)
