The group finalizes the design and implementation of their prototype system. The group submits their final code as a zip file to Gradescope such that the corresponding teaching staff can upload the latest version to the TV setup before live project demos.

This assignment will be evaluated based on:
a) Whether the code can run on the display (1 pts)
b) The system prototype addresses the group’s two tasks from Assignment 5 (2 pts per task; 4 pts)

c) The code includes a README text file that explains how to install any dependencies and run the project (2 pts), provides a brief description of the project and what tasks the installation addresses (1 pts), indicates explicitly if there are any constraints from the deployment environment (0.5 pts), and includes a collaboration record that specifies what each team member contributed to the prototype (1.5 pts).

By including constraints from the deployment environment in the README, we mean that the text file should explain any physical constraints that are important to consider when the course staff evaluates the system prototype. For instance, would users need to be able to stand at least a minimum distance away from the Kinect for the application to run as intended?

Worth noting, Python projects must be implemented such that they can run in a virtual environment. These projects need to include in the source code a requirements.txt file that includes all Python dependencies (so that they can be instealled with pip as pip install -r requirements.txt).

Usage Instructions:

Physical Constraints:
Since we are using pelvic joint data in our project, the users need to be standing ~6 feet away from the display so that their pelvic joint is detected by the Kinect sensor. 




(c) Brief description of the project and user tasks the installation addresses: this project is a music quiz in single player mode, where participants answer questions related to music, favorite computer science class, and other random questions. To select an answer, the user has to move their body to the side of the option they want to select for three seconds. The user is also able to go back to a previous question (raising left hand over back button for 3 seconds) or move on to next question (raising right hand over forward button for 3 seconds). At the end of the quiz, the user is given their favorite genre of music (e.g. pop), and a QR code is provided that can be scanned to add a song of their choice in that genre to a community Spotify playlist. The installation addresses the following user tasks: 


