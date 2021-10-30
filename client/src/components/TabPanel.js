import React from 'react';
import { Box, Typography } from '@mui/material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1, height: 590, overflow: 'scroll' }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default TabPanel;