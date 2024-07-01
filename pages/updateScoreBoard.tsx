import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Table, Image, Button, FormControl } from 'react-bootstrap';
import { UserContext } from '@/context/userContext';

interface CommunityCenter {
  communityCenterID: number;
  communityCenterName: string;
  communityCenterPoints: number;
}

const UpdateScoreBoard = () => {
  const [standings, setStandings] = useState<CommunityCenter[]>([]);
  const [editPoints, setEditPoints] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<string | null>(null); // Initialize as null
  const [updatedPoints, setUpdatedPoints] = useState<number | null>(null)
  const [successfullyUpdated, setSuccessfullyUpdated] = useState<boolean>(false)
  const {user} = useContext(UserContext)
  useEffect(() => {
    try {
      axios.get('https://superteensolympicsserver-1.onrender.com')
        .then((res) => {
          setStandings(res.data);
          setEditPoints(false)
          setEditRow(null)
          setUpdatedPoints(null)
          setSuccessfullyUpdated(false)
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log("error getting community centers:", e);
    }
}, [successfullyUpdated]);

const updatePoints = (communityCenterName: string) =>{
      try {
        axios.post(`https://superteensolympicsserver-1.onrender.com/updatePoints/${communityCenterName}/${updatedPoints}`,)
          .then((res) => {
            console.log(res.data)
            setSuccessfullyUpdated(true)
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log("error getting community centers:", e);
      }

  }
console.log(standings)
console.log(editRow)
return (
    <div className='homePage'>
      {user && user.adminID ? (
        <div>
          <div className='logoContainer'>
            <Image src={'/olympicRings.png'} alt='olympic rings' className='logoImage' />
            <Image src={'/BCYFLogo.png'} alt='BCYF logo' className='logoImage' />
          </div>
          <h1>SuperTeens Olympics 2024</h1>
          
          {standings.length > 0 && (
            <Table striped hover className='standingsTable'>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Community Center</th>
                  <th>Points</th>
                  <th>Edit Points</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((center, index) => (
                  <tr key={center.communityCenterID}>
                    <td>{index + 1}</td>
                    <td>{center.communityCenterName}</td>
                    {editPoints && editRow === center.communityCenterName ? (
                      <>
                        <td>
                          <p>Current Points: {center.communityCenterPoints}</p>
                          <input type="number" onChange={(e) => setUpdatedPoints(Number(e.target.value))} />
                        </td>
                        <td>
                          <button onClick={() => updatePoints(center.communityCenterName)}>Save Points</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{center.communityCenterPoints}</td>
                        <td>
                          <button
                            onClick={() => {
                              setEditRow(center.communityCenterName);
                              setEditPoints(true);
                            }}
                          >
                            Edit Points
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      ) : (
        <h2>You Do Not Have Access To This Page. Return to Home Page!</h2>
      )}
    </div>
  );
  
};

export default UpdateScoreBoard;
