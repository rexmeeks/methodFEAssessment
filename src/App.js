import './App.css';
import {
  Button, Grid, Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {PreUploadComponent} from "./components/PreUploadComponent";

/*****
 * Replace this with account token for full flow
 *****/
const token = 'sk_PcU8cHPMxMjNpNAMV4xLaJRy';

function App() {

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [paymentsToBeMade, setPaymentsToBeMade] = useState([]);
  const [file, setFile] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8080/reports").then((response) => {
      console.log(response.data)
      setRows(response.data.reportsList);
    }).catch((e) => {
      console.log(e);
    })
  }, [open])

  const getReportByIdAndType = (id, type) => {
    axios({
      url: `http://localhost:8080/reports/${id}?type=${type}`,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${type}-${id}.csv`); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }

  const getReportFromMethod = (id) => {
    axios({
      url: `https://dev.methodfi.com/reports/${id}/download`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      // create file link in browser's memory
      const href = URL.createObjectURL(response.data);

      // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `full-${id}.csv`); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }

  const uploadCsv = async (fileToUpload, preupload, setLoading) => {
    let formData = new FormData();
    formData.append('file', preupload ? fileToUpload : file);
    await axios.post(`http://localhost:8080/uploadPayouts?preupload=${preupload}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(
        (response) => {
          if(!preupload) {
            setLoading(false);
            handleCancel();
          } else {
            setPaymentsToBeMade(response.data.preuploadPayments);
            setOpen(true);
          }
        }
    ).catch((e) => {
          console.log(e);
        }
    )
  }

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setFile(files[0]);
    uploadCsv(files[0], true);
  }

  const handleCancel = () => {
    setFile({});
    setOpen(false);
  }

  const downloadButtons = (id) => {
    // this should be a component, but in the interest of time, and because it's so small, I'm doing it like this
    return (
        <>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Button onClick={() => getReportByIdAndType(id, "method")}>By Source Id</Button>
            </Grid>
            <Grid item xs={4}>
              <Button onClick={() => getReportByIdAndType(id, "dunkin")}>By Branch Id</Button>
            </Grid>
            <Grid item xs={4}>
              <Button onClick={() => getReportFromMethod(id)}>Full</Button>
            </Grid>
          </Grid>
        </>
    )
  }

  return (
      <div className="App">
        <header className="App-header">
          <Grid container spacing={1}>
            <Grid item mt={1} xs={12}>
              <Button
                  variant="contained"
                  component="label"
              >
                Upload Payments XML File
                <input
                    type="file"
                    onChange={(e) => handleFile(e)}
                    onClick={(event)=> {
                      event.target.value = null
                    }}
                    hidden
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left"><Typography variant='h6' sx={{fontWeight: 'bold'}}>File Name</Typography></TableCell>
                      <TableCell align="left"><Typography variant='h6' sx={{fontWeight: 'bold'}}>Uploaded
                        On</Typography></TableCell>
                      <TableCell align="center"><Typography variant='h6' sx={{fontWeight: 'bold'}}>Report
                        CSVs</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="left">{row.fileName}</TableCell>
                          {/* todo this will probably need to be formatted idk */}
                          <TableCell align="left">{row.uploadedOn}</TableCell>
                          <TableCell align="center">{downloadButtons(row.id)}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Modal open={open}>
            <PreUploadComponent paymentsToBeMade={paymentsToBeMade} handleCancel={handleCancel} uploadCsv={uploadCsv}/>
          </Modal>
      </header>
    </div>
  );
}

export default App;
