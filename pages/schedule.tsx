import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Image, Button, FormControl } from 'react-bootstrap';

interface CommunityCenter {
  communityCenterID: number;
  communityCenterName: string;
  communityCenterPoints: number;
}

const UpdateScoreBoard = () => {
  const [standings, setStandings] = useState<CommunityCenter[]>([]);
  const [editedPoints, setEditedPoints] = useState<{ [id: number]: number | '' }>({});

  useEffect(() => {
    axios.get('http://localhost:8000')
      .then((res) => {
        setStandings(res.data);
        const initialEditedPoints = res.data.reduce((acc: { [id: number]: number | '' }, center: CommunityCenter) => {
          acc[center.communityCenterID] = '';
          return acc;
        }, {});
        setEditedPoints(initialEditedPoints);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handlePointsChange = (id: number, points: number | '') => {
    setEditedPoints((prev) => ({
      ...prev,
      [id]: points,
    }));
  };

  const handleSave = (id: number) => {
    const points = editedPoints[id];
    if (points === '') return;

    axios.post('http://localhost:8000/updatePoints', {
      communityCenterID: id,
      points: points
    })
    .then(() => {
      setStandings((prev) => prev.map(center => 
        center.communityCenterID === id 
          ? { ...center, communityCenterPoints: points } 
          : center
      ));
      setEditedPoints((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    })
    .catch((e) => {
      console.log(e);
    });
  };

  return (
    <div className='homePage'>
      <div>
        <div className='logoContainer'>
          <Image src={'/olympicRings.png'} alt='olympic rings' className='logoImage' />
          <Image src={'/BCYFLogo.png'} alt='olympic rings' className='logoImage' />
        </div>
        <h1>SuperTeens Olympics 2024</h1>
      </div>
      {standings.length > 0 &&
        <Table striped hover className='standingsTable'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Community Center</th>
              <th>Points</th>
              <th>Update Points</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((center, index) => (
              <tr key={center.communityCenterID}>
                <td>{index + 1}</td>
                <td>{center.communityCenterName}</td>
                <td>{center.communityCenterPoints}</td>
                <td>
                  <FormControl
                    type='number'
                    value={editedPoints[center.communityCenterID] || ''}
                    onChange={(e) => handlePointsChange(center.communityCenterID, e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </td>
                <td>
                  <Button 
                    variant='primary' 
                    onClick={() => handleSave(center.communityCenterID)}
                    disabled={editedPoints[center.communityCenterID] === undefined || editedPoints[center.communityCenterID] === ''}
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }
    </div>
  );
}

export default UpdateScoreBoard;
