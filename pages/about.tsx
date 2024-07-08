import React from 'react'

const About = () => {
  return (
    <div className='aboutPage'>
        <img src='/st.png' style={{"height": '350px'}}></img>
    <p>
    The 2024 BCYF SuperTeens Program is a six-week leadership program for 13-year-old City of Boston residents interested in developing new skills, making new friends and having a fun and enriching summer.
    </p>
    <p>
    SuperTeens is led by BCYF Staff Mentors (Youthworkers, Program Supervisors, Program Assistants, etc.)  throughout our network of community centers. SuperTeens participants meet with BCYF Staff Mentors for on-site, neighborhood-based programming and also attend special programs throughout the week with the entire citywide program. Selected experiential learning activities are intended to encourage teen participants to make new friends, develop readiness for the upcoming school year and prepare teen participants to successfully enter the workforce in the future. At the end of the SuperTeens program, participants who have participated in all required activities and have met our attendance goals will receive a participant stipend.
    </p>
    <p>
    For the 2024 season, SuperTeens will be hosted at 18 BCYF Sites! This year our program will focus on opportunities to enhance communication, collaboration, team work and problem solving.  
    </p>
    <p>
    With the Paris Olympics this summer, we thought it would be great to take inspiration from that and put it towards SuperTeens. Our 18 different BCYF sites will serve as their own &quot;country&quot; or team, competing in games all summer long against other BCYF sites.
    </p>
    <div style={{textAlign:'center'}}>
        <h3>2024 SuperTeens Events:</h3>
        <ul style={{listStylePosition:'outside', paddingLeft:'20px', width:'200px', margin:'auto', paddingBottom:'20px'}}>
            <li>DodgeBall</li>
            <li>KickBall</li>
            <li>5K</li>
            <li>Archery</li>
            <li>Rowing</li>
            <li>Water Carnival</li>
            <li>Amazing Race</li>
        </ul>
    </div>
    <p>Stay tuned to see who wins Gold in these events, and ends the summer as the 2024 SuperTeens Olympic Champions!</p>
    </div>
    
    
  )
}

export default About