import React, { useState } from "react";
import { Container, TextField, Button, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const RFPForm = () => {
    const [formData, setFormData] = useState({
      payeeName: "",
      matricNo: "",
      category: "Meals & Refreshments",
      eventName: "",
      committee: "",
      expenseCount: 1, // Track how many expenses are entered
      expense1receiptno: "",
      expense1description: "",
      expense1amount: "",
      expense1purchasetype: "",
      expense2receiptno: "",
      expense2description: "",
      expense2amount: "",
      expense2purchasetype: "",
      expense3receiptno: "",
      expense3description: "",
      expense3amount: "",
      expense3purchasetype: "",
      expense4receiptno: "",
      expense4description: "",
      expense4amount: "",
      expense4purchasetype: "",
      expense5receiptno: "",
      expense5description: "",
      expense5amount: "",
      expense5purchasetype: "",
      file: null,
    });
  
    // Track number of rows dynamically
    const [expenseCount, setExpenseCount] = useState(1);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFileChange = (e) => {
      setFormData({ ...formData, file: e.target.files[0] });
    };
  
    const handleAddRow = () => {
        if (expenseCount < 5) {
          const newCount = expenseCount + 1;
          setExpenseCount(newCount);
          setFormData({
            ...formData,
            expenseCount: newCount.toString(), // Update the expenseCount in form data
          });
        }
      };
      
      const handleRemoveRow = (rowIndex) => {
        if (expenseCount > 1) {
          const newCount = expenseCount - 1;
          setExpenseCount(newCount);
          setFormData({
            ...formData,
            expenseCount: newCount.toString(), // Update the expenseCount in form data
          });
        }
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const processedFormData = { ...formData };
      
        // Update expenseCount to reflect the correct number of expenses
        const actualExpenseCount = parseInt(formData.expenseCount);
      
        // Loop through all possible expense rows based on the current expenseCount
        for (let i = 1; i <= actualExpenseCount; i++) {
          // For each expense, check receiptno, description, amount, and purchasetype
          ['receiptno', 'description', 'amount', 'purchasetype'].forEach((field) => {
            const key = `expense${i}${field.charAt(0).toUpperCase() + field.slice(1)}`;
            // Replace empty fields with " "
            if (processedFormData[key] === "") {
              processedFormData[key] = " ";
            }
          });
        }
      
        // Prepare FormData to send the data
        const data = new FormData();
        
        // Append all form data to FormData object
        Object.keys(processedFormData).forEach((key) => {
          if (key === "file" && formData.file) {
            data.append(key, formData.file);
          } else {
            data.append(key, processedFormData[key]);
          }
        });
      
        try {
          const response = await fetch("https://rfpbackend.onrender.com/submit", {
            method: "POST",
            body: data,
          });
          if (response.ok) {
            alert("Form submitted successfully!");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      };
      
  
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
          <Typography variant="h5" gutterBottom>Request for Payment (RFP)</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Payee Name" name="payeeName" value={formData.payeeName} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Matric No." name="matricNo" value={formData.matricNo} onChange={handleChange} margin="normal" />
            
            <Typography variant="body1" sx={{ marginTop: 2 }}>Category</Typography>
            <Select fullWidth name="category" value={formData.category} onChange={handleChange}>
              <MenuItem value="Meals & Refreshments">Meals & Refreshments</MenuItem>
              <MenuItem value="Student Prizes & Awards">Student Prizes & Awards</MenuItem>
              <MenuItem value="Logistics/Equipment">Logistics/Equipment</MenuItem>
              <MenuItem value="Licenses/Subscription">Licenses/Subscription</MenuItem>
              <MenuItem value="Hospitality">Hospitality</MenuItem>
            </Select>
            
            <TextField fullWidth label="Event Name" name="eventName" value={formData.eventName} onChange={handleChange} margin="normal" />
            <TextField fullWidth label="Committee" name="committee" value={formData.committee} onChange={handleChange} margin="normal" />
  
            <Typography variant="h6" sx={{ marginTop: 2 }}>Expense Details</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S/N</TableCell>
                    <TableCell>Receipt / Invoice No.</TableCell>
                    <TableCell>Description of Expense</TableCell>
                    <TableCell>SGD Amount (incl GST)</TableCell>
                    <TableCell>Online Purchases</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(expenseCount)].map((_, index) => {
                    const rowIndex = index + 1;
                    return (
                      <TableRow key={rowIndex}>
                        <TableCell>{rowIndex}</TableCell>
                        <TableCell>
                          <TextField
                            name={`expense${rowIndex}receiptno`}
                            value={formData[`expense${rowIndex}receiptno`]}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`expense${rowIndex}description`}
                            value={formData[`expense${rowIndex}description`]}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`expense${rowIndex}amount`}
                            value={formData[`expense${rowIndex}amount`]}
                            onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            name={`expense${rowIndex}purchasetype`}
                            value={formData[`expense${rowIndex}purchasetype`]}
                            onChange={handleChange}
                          >
                            <MenuItem value="Local">Local</MenuItem>
                            <MenuItem value="Overseas">Overseas</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {rowIndex > 1 && (
                            <IconButton onClick={() => handleRemoveRow(rowIndex)} color="primary">
                              <Delete />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
  
            <Button variant="contained" color="primary" onClick={handleAddRow} sx={{ marginTop: 2 }}>
              <Add /> Add Row
            </Button>
  
            <Typography variant="body1" sx={{ marginTop: 2 }}>Upload Receipt/Invoice:</Typography>
            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>Submit</Button>
          </form>
        </Paper>
      </Container>
    );
  };
  
  export default RFPForm;
  
