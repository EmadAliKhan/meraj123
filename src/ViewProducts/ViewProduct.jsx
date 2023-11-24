// import * as React from 'react';
// import { useState,useEffect } from 'react';
// import axios from 'axios'
// import { styled } from '@mui/material/styles';
// import Card from '@mui/material/Card';
// import Box from '@mui/material/Box'
// import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';
// import Collapse from '@mui/material/Collapse';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// // import { Stack, TextField } from '@mui/material'
// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
  
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// export default function ViewProduct() {
//   const [data, setData] = useState([])
//   const[isLoading,setIsLoading]= useState(false)
//   const getData = async () => {
//     setIsLoading(true)
//     try {
//       const response = await axios.get("https://fakestoreapi.com/products/")
//       setData(response.data)
//       console.log(response.data);
//       setIsLoading(false)
//     } catch (error) {
//       console.log("ERROR: " + error);
//       setIsLoading(false)
//     }
//   }
//   useEffect(() => { 
//     getData()
//   }, [])
//   const [expanded, setExpanded] = React.useState(false);

//   const handleExpandClick = () => {
//     setExpanded(!expanded);
//   };

//   return (
//     <>
//       <Box sx={{marginTop:"10px",display:"flex",flexWrap:"wrap" ,gap:"10px",justifyContent:"center"}}>
//         {
//             isLoading?<Box sx={{display:'flex',justifyContent:'center',textAlign:'center'}}>
//             <img src='https://i.stack.imgur.com/8puiO.gif' width={200}/>
//           </Box>:
//           data.map((e, i) => {
//             return (
//               <Card key={i} sx={{ maxWidth: 345,marginTop:5 }}>
//                 <CardHeader
//                   title={e.category}
//                 />
//                 <CardMedia
//                   component="img"
//                   height="194"
//                   image={e.image}
//                   alt="Paella dish"
//                 />
//                 <CardContent>
//                   <Typography sx={{fontSize:"20px"}}>
//                     {e.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {e.description}
//                 {/* {e.slice(0,18)} */}
//                 {/* slice{(e.length,e.description)} */}
//                   </Typography>
//                 </CardContent>
//                 <CardActions disableSpacing>
//                   <IconButton aria-label="add to favorites">
//                     <FavoriteIcon />
//                   </IconButton>
//                   <IconButton aria-label="share">
//                     <ShareIcon />
//                   </IconButton>
//                   <ExpandMore
//                     expand={expanded}
//                     onClick={handleExpandClick}
//                     aria-expanded={expanded}
//                     aria-label="show more"
//                   >
//                     <ExpandMoreIcon />
//                   </ExpandMore>
//                 </CardActions>
//                 <Collapse in={expanded} timeout="auto" unmountOnExit>
//                   <CardContent>
//                     <Typography paragraph>Method:</Typography>
//                     <Typography paragraph>
//                     <button>Buy Now</button>
//                     </Typography>
//                   </CardContent>
//                 </Collapse>
//               </Card>
//             )
//           })
//         }
//       </Box>
//     </>
//   );
// }


import { Button, Stack,  } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DATABASE, ref, onChildAdded } from '../Firebase/Firebase';
import { STORAGE,storageRef } from '../Firebase/Firebase';
import { listAll, getDownloadURL } from 'firebase/storage';
import BasicModal from '../modalButton/Modal';

const UploadProduct = () => {
  const [uploadData, setUploadData] = useState([]);
  // const [imageUpload,setImageUpload] = useState('');
  const[imageList,setImageList] = useState([])
  const [cart,setCart] = useState([]);

  const imageListRef = storageRef(STORAGE,"images/")
  useEffect(() => {
    let isMounted = true;
    getDataFromDatabase();
    listAll(imageListRef).then((response)=>{
      // console.log(response);
      response.items.forEach((item)=>{
        getDownloadURL(item).then((url)=>{
          if(isMounted){
            setImageList((prevData)=>[...prevData,url])
          }
        })
      })
    });  return () => {
      isMounted = false;
    };
  }, []); // Run once when the component mounts


  function getDataFromDatabase() {
    var reference = ref(DATABASE);
    onChildAdded(reference, function (data) {
      setUploadData(() => data.val());
    });
  }

  const handleAddToCart = (productData)=>{
    setCart((prevCart) => [...prevCart, productData]);
  }
  console.log(cart);
  return (
    <Stack>
      <BasicModal label={cart}/>
      {/* Render uploaded data */}
      {uploadData.map((data, index) => (    
        <div key={index}>
       <img src={imageList[index]} width={200} alt="" />
          <h1>{data.title}</h1>
          <h1>{data.description}</h1>
          {/* <h1>{data.price}</h1> */}
          <Button variant='contained' type='submit'   onClick={() => handleAddToCart(data)}>{data.price}</Button>
        </div>
      ))}
    </Stack>
  );
};

export default UploadProduct;
