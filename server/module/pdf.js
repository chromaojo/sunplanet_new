const express = require('express');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb , StandardFonts } = require('pdf-lib');
const bodyParser = require('body-parser');
const route = express.Router();

// Middleware
route.use(express.static(path.join(__dirname, '../public')));
route.use(bodyParser.json());

// Route to render receipt data
route.get('/gen', async (req, res) => {
    // const { customerName, date, amount, receiptNumber } = req.body;
    const customerName = 'Segun Tester Gabnut';
    const date = '23-May-2029'
    const amount = '800000'
    const receiptNumber =2345678765;

    try {
        // Load the PDF template
        const templatePath = path.join(__dirname, 'pdf', 'receipt-template.pdf');
        const templateBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);


        // Get the first page of the PDF
        const page = pdfDoc.getPages()[0]; 
        console.log('The PDF Doc is',pdfDoc);
        console.log('The PDF page is',page);

        // Customize font size, position, and content
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        page.drawText(`Customer Name: ${customerName}`, { x: 40, y: 600, size: 16, font, color: rgb(0, 0, 0) });
        page.drawText(`Date: ${date}`, { x: 90, y: 580, size: 14, font, color: rgb(0, 0, 0) });
        page.drawText(`Amount: ${amount} NGN`, { x: 650, y: 560, size: 14, font, color: rgb(0, 0, 0) });
        page.drawText(`Receipt #: ${receiptNumber}`, { x: 500, y: 530, size: 14, font, color: rgb(0, 0, 0) });

        // Save the modified PDF as bytes
        const pdfBytes = await pdfDoc.save();

        // Send the PDF as a response
        res.setHeader('Content-Type', 'routelication/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="receipt.pdf"');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating receipt');
    }
});


module.exports = route; 
