import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { filterVehicleObj } from './utils';
import PrimeDynoChart from './components/PrimeDynoChart';

const cars = [
  {
    manufacturer: 'Mercedes Benz',
    model: 'SLS AMG',
    year: '2015',
    engineDisplacement: '6.3',
    weight: '3,726',
    rpmRedLine: '6500',
    imageUrl:
      'https://file.kelleybluebookimages.com/kbb/base/house/2015/2015-Mercedes-Benz-SLS-Class-FrontSide_MBSLSR151_640x480.jpg',
  },
  {
    manufacturer: 'Freightliner',
    model: 'M2-112 Plus',
    year: '2018',
    engineDisplacement: '12.8',
    weight: '30,000',
    rpmRedLine: '4000',
    imageUrl:
      'https://ftl-media.imgix.net/19844-ftc-42n_alltruckspage_m2-112_plus.jpg',
  },
  {
    manufacturer: 'T.B. Buses',
    model: 'Saf-T-Liner C2 Bus',
    year: '2014',
    engineDisplacement: '5.1',
    weight: '12,000',
    rpmRedLine: '4500',
    imageUrl:
      'https://thomasbuiltbuses.com/content/uploads/2017/02/C2_Frontish_RGB.jpg',
  },
];

const socket = io.connect('http://localhost:5001');

function App() {
  const [selectedCar, setSelectedCar] = useState(cars[0]);
  const [horsepowerData, setHorsePowerData] = useState([]);
  const [torqueData, setTorqueData] = useState([]);
  const [rpmData, setRpmData] = useState([]);
  const [isDynoRunning, setIsDynoRunning] = useState(false);
  const [chartTitle, setChartTitle] = useState('');

  useEffect(() => {
    socket.on('update', (data) => {
      const newHorsepower = data.horsepower;
      const newTorque = data.torque;
      const newRpm = data.rpm;
      setHorsePowerData((prevData) => [...prevData, newHorsepower]);
      setTorqueData((prevData) => [...prevData, newTorque]);
      setRpmData((prevData) => [...prevData, newRpm]);
    });

    socket.on('stop', (data) => {
      setIsDynoRunning(false);
      setChartTitle(data.message);
    });
  }, [socket]);

  const onSelectClick = (car) => setSelectedCar(car);
  
  const onDynoSelectedVehicle = () => {
    if(chartTitle !== '') {
      setHorsePowerData([]);
      setTorqueData([]);
      setRpmData([]);
    }
    setIsDynoRunning(true);
    setChartTitle(
      `Dynoing ${selectedCar.manufacturer} ${selectedCar.model}...`
    );
    const vehicle = filterVehicleObj(selectedCar);
    socket.emit('start', { vehicle });
  };

  return (
    <div className='h-screen w-screen p-2'>
      <div className='bg-black p-6 rounded-md'>
        <h1 className='text-white text-2xl font-semibold'>
          SocketIO Prototype - Dyno Simulator
        </h1>
      </div>
      <div className='flex flex-row'>
        {cars.map((car) => {
          const isSelected = selectedCar.model === car.model;
          return (
            <div className='w-full sm:w-1/2 md:w-1/4 m-4' key={car.rpmRedLine}>
              <Card className=''>
                <CardMedia
                  sx={{ height: 260 }}
                  image={car.imageUrl}
                  title={car.model}
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {car.manufacturer} {car.model}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    disabled={isDynoRunning}
                    variant={isSelected ? 'contained' : 'text'}
                    color={isSelected ? 'success' : 'primary'}
                    onClick={() => onSelectClick(car)}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                  {isSelected && (
                    <Button
                      onClick={onDynoSelectedVehicle}
                      disabled={isDynoRunning}
                      variant='contained'
                      color='secondary'
                    >
                      Dyno Vehicle
                    </Button>
                  )}
                </CardActions>
              </Card>
            </div>
          );
        })}
      </div>

      {torqueData.length > 0 && (
        <div className='p-8 w-4/5'>
          <h2 className='text-2xl text-center'>{chartTitle}</h2>
          <PrimeDynoChart
            torque={torqueData}
            horsepower={horsepowerData}
            rpm={rpmData}
          />
        </div>
      )}
    </div>
  );
}

export default App;
