https://terrierrailsassessment.onrender.com/ 

Design:
I used PostgreSQL and three models. Made a rake file with some validation and idempotent. 

Added some basic database management to make sense of the data.

Made a gride. Made a function to identify overlapping. And added a click feature.


Problems Faced:
Tons, I have never used Ruby on Rails, PostgreSQL, or Render.

Future Improvements: 
There are bugs. For some reason the clickable event isn't always accurate, usually in column 3. 
The detect overlap is supposed to change the affected boxes redish but that broke after I changed the formating.

Styling was minimual. I'd do alot. Round the corners, pick some colors, and dark mode. 

To run locally:
clone from https://github.com/thoughthough/TerrierRailsAssessment

Have: 
ruby 3.4.1
Rails 8.0.1

Then run:
gem install bundler

bundle install

rails db:create

rails db:migrate

rails import:all

rails assets:precompile

rails server

Go to localhost:3000
