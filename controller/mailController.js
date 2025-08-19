const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const EmailTemplate = require("../model/template");
const emailTemplates = require("../template");
const path = require('path');

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465, // Use 465 for SSL, 587 for TLS
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// exports.sendEmails = async (req, res) => {
//     const { subject, employee, desc } = req.body;

//     // Validate request body
//     if (!subject || !employee || !Array.isArray(employee) || employee.length === 0) {
//         return res.status(400).json({
//             message: "Invalid request. Ensure all fields are provided and 'employee' is a non-empty array."
//         });
//     }
//     // console.log(typeof (templateId));

//     // Find the email template by templateId
//     // const emailTemplate = emailTemplates.find(t => t.id === +templateId);
//     // if (!emailTemplate) {
//     //     return res.status(401).json({ message: "Email template not found." });
//     // }

//     try {
//         // Map over each employee and send emails concurrently
//         const emailPromises = employee.map(async ({ name, company, email, gender }) => {
//             // Replace template placeholders with actual data
//             let fName = name.split(' ')[0]
//             const emailBody = desc
//                 .replace(/{{first_name}}/g, fName)
//                 .replace(/{{gender}}/g, gender)
//                 .replace(/{{company_name}}/g, company);

//             // Set up mail options
//             const mailOptions = {
//                 from: `"ONKAR BORGAONKAR" <${process.env.EMAIL_USER}>`,
//                 to: email,
//                 subject: subject,
//                 text: emailBody.replace(/<[^>]*>?/gm, ""), // Strip HTML tags for plain text version
//                 html: emailBody,
//                 attachments: [
//                     {
//                         filename: 'about_me.pdf',
//                         path: path.join(__dirname, 'files', 'about_me.pdf'),
//                         contentType: 'application/pdf'
//                     },
//                     {
//                         filename: 'SDE1.pdf',
//                         path: path.join(__dirname, 'files', 'SDE1.pdf'),
//                         contentType: 'application/pdf'
//                     }
//                 ]
//             };

//             // Send email using the transporter
//             return transporter.sendMail(mailOptions);
//         });

//         // Wait for all emails to be sent
//         await Promise.all(emailPromises);

//         // Return success response with details
//         return res.status(200).json({
//             message: "Emails sent successfully",
//             templateId,
//             subject,
//             recipients: employee.map(e => e.email)
//         });
//     } catch (error) {
//         // Catch any error that occurs during the sending process
//         return res.status(500).json({
//             message: "Failed to send emails",
//             error: error.message
//         });
//     }
// };

exports.sendEmails = async (req, res) => {
    // We've changed 'desc' to 'body' here to match your payload
    const { subject, employee, body } = req.body;

    // Validate request body
    if (!subject || !employee || !Array.isArray(employee) || employee.length === 0) {
        return res.status(400).json({
            message: "Invalid request. Ensure all fields are provided and 'employee' is a non-empty array."
        });
    }

    try {
        // Map over each employee and send emails concurrently
        // const emailPromises = employee.map(async ({ name, company, email, gender }) => {
        //     // Replace template placeholders with actual data
        //     let fName = name.split(' ')[0]

        //     // Using 'body' instead of 'desc'
        //     const emailBody = body
        //         .replace(/{{first_name}}/g, fName)
        //         .replace(/{{gender}}/g, gender)
        //         .replace(/{{company_name}}/g, company);

        //     // Set up mail options
        //     const mailOptions = {
        //         from: `"ONKAR BORGAONKAR" <${process.env.EMAIL_USER}>`,
        //         to: email,
        //         subject: subject,
        //         text: emailBody.replace(/<[^>]*>?/gm, ""), // Strip HTML tags for plain text version
        //         html: emailBody,
        //         attachments: [
        //             {
        //                 filename: 'about_me.pdf',
        //                 path: path.join(__dirname, 'files', 'about_me.pdf'),
        //                 contentType: 'application/pdf'
        //             },
        //             {
        //                 filename: 'SDE1.pdf',
        //                 path: path.join(__dirname, 'files', 'SDE1.pdf'),
        //                 contentType: 'application/pdf'
        //             }
        //         ]
        //     };

        //     // Send email using the transporter
        //     return transporter.sendMail(mailOptions);
        // });

        const emailPromises = employee.map(async ({ name, company, email, gender }) => {
            // Replace template placeholders with actual data
            let fName = name.split(' ')[0];

            // Using 'body' instead of 'desc'
            let emailBody = body
                .replace(/{{first_name}}/g, fName)
                .replace(/{{company_name}}/g, company);

            // Conditionally replace the gender placeholder if gender is present
            if (gender) {
                emailBody = emailBody.replace(/{{gender}}/g, gender);
            } else {
                // If gender is not provided, remove the placeholder
                emailBody = emailBody.replace(/{{gender}}/g, '').trim();
                // Use .trim() to remove any leading/trailing whitespace left by the placeholder
            }

            // Set up mail options
            const mailOptions = {
                from: `"ONKAR BORGAONKAR" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: subject,
                text: emailBody.replace(/<[^>]*>?/gm, ""), // Strip HTML tags for plain text version
                html: emailBody,
                attachments: [
                    {
                        filename: 'about_me.pdf',
                        path: path.join(__dirname, 'files', 'about_me.pdf'),
                        contentType: 'application/pdf'
                    },
                    {
                        filename: 'SDE1.pdf',
                        path: path.join(__dirname, 'files', 'SDE1.pdf'),
                        contentType: 'application/pdf'
                    }
                ]
            };

            // Send email using the transporter
            return transporter.sendMail(mailOptions);
        });

        // Wait for all emails to be sent
        await Promise.all(emailPromises);

        // Return success response with details
        return res.status(200).json({
            message: "Emails sent successfully",
            subject,
            recipients: employee.map(e => e.email)
        });
    } catch (error) {
        // Catch any error that occurs during the sending process
        return res.status(500).json({
            message: "Failed to send emails",
            error: error.message
        });
    }
};





// Get all email templates
exports.getEmailTemplates = asyncHandler(async (req, res) => {
    try {
        const templates = await EmailTemplate.find();
        res.status(200).json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get email template by job title
exports.getEmailTemplateByJobTitle = asyncHandler(async (req, res) => {
    const { jobTitle } = req.params;

    try {
        const template = await EmailTemplate.findOne({ jobTitle });

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new email template
exports.addEmailTemplate = asyncHandler(async (req, res) => {
    const { jobTitle, subject, body } = req.body;

    if (!jobTitle || !subject || !body) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const template = new EmailTemplate({ jobTitle, subject, body });
        const newTemplate = await template.save();

        res.status(201).json(newTemplate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an email template
exports.updateEmailTemplate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { jobTitle, subject, body } = req.body;

    if (!jobTitle || !subject || !body) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
            id,
            { jobTitle, subject, body },
            { new: true, runValidators: true }
        );

        if (!updatedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.status(200).json(updatedTemplate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an email template
exports.deleteEmailTemplate = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTemplate = await EmailTemplate.findByIdAndDelete(id);

        if (!deletedTemplate) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
