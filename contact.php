<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $contactNumber = $_POST["contactNumber"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    // Set your email address where you want to receive the form submissions
    $to = "ask@halhabeel.co";

    // Email subject
    $subject = "Website Form Submission";

    // Email message
    $body = "Name: $name\nContact Number: $contactNumber\nEmail: $email\nMessage: $message";

    // Additional headers
    $headers = "From: $email";

    // Set the sendmail_from variable
    ini_set("sendmail_from", "ask@halhabeel.co");

    // Attempt to send the email with the fifth parameter (-f)
    $sent = mail($to, $subject, $body, $headers, "-f ask@halhabeel.co");

    // Check if the email was sent successfully
    if ($sent) {
        // Email sent successfully
        echo json_encode(array("success" => true, "message" => "Email sent successfully"));
    } else {
        // Failed to send email
        echo json_encode(array("success" => false, "message" => "Failed to send email"));
        // Add some debugging information
        echo "Error: " . error_get_last()['message'];
    }
} else {
    // Invalid request method
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
}
?>
