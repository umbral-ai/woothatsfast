---
title: "Building a Custom WooCommerce Payment Gateway"
description: "Step-by-step guide to creating a secure and scalable custom payment gateway integration for WooCommerce."
pubDate: 2024-01-28
author: "Daniel Snell"
category: "Development"
featured: false
---

## Introduction

Creating a custom payment gateway for WooCommerce requires careful consideration of security, user experience, and scalability. Here's a comprehensive guide to building a professional payment integration.

## Basic Gateway Structure

```php
class WC_Custom_Payment_Gateway extends WC_Payment_Gateway {
    public function __construct() {
        $this->id = 'custom_gateway';
        $this->icon = '';
        $this->has_fields = true;
        $this->method_title = 'Custom Payment Gateway';
        $this->method_description = 'A secure custom payment gateway integration';
        
        $this->supports = [
            'products',
            'refunds',
            'tokenization'
        ];
        
        $this->init_form_fields();
        $this->init_settings();
        
        $this->title = $this->get_option('title');
        $this->description = $this->get_option('description');
        
        add_action('woocommerce_update_options_payment_gateways_' . $this->id, 
            [$this, 'process_admin_options']
        );
    }
}
```

## Gateway Configuration

```php
public function init_form_fields() {
    $this->form_fields = [
        'enabled' => [
            'title' => 'Enable/Disable',
            'type' => 'checkbox',
            'label' => 'Enable Custom Payment Gateway',
            'default' => 'no'
        ],
        'title' => [
            'title' => 'Title',
            'type' => 'text',
            'description' => 'Payment method title',
            'default' => 'Custom Payment'
        ],
        'api_key' => [
            'title' => 'API Key',
            'type' => 'password',
            'description' => 'Enter your payment provider API key'
        ],
        'sandbox_mode' => [
            'title' => 'Sandbox Mode',
            'type' => 'checkbox',
            'label' => 'Enable test mode',
            'default' => 'yes'
        ]
    ];
}
```

## Payment Processing

```php
public function process_payment($order_id) {
    $order = wc_get_order($order_id);
    
    try {
        // Validate payment data
        $this->validate_payment_fields();
        
        // Process payment with API
        $payment_result = $this->process_payment_request([
            'amount' => $order->get_total(),
            'currency' => $order->get_currency(),
            'payment_method' => $this->get_payment_method_token(),
            'description' => sprintf('Order #%s', $order->get_order_number())
        ]);
        
        if ($payment_result->success) {
            // Mark order as paid
            $order->payment_complete($payment_result->transaction_id);
            
            // Add transaction data
            $order->add_order_note(sprintf(
                'Payment processed successfully. Transaction ID: %s',
                $payment_result->transaction_id
            ));
            
            // Empty cart
            WC()->cart->empty_cart();
            
            return [
                'result' => 'success',
                'redirect' => $this->get_return_url($order)
            ];
        }
        
        throw new Exception($payment_result->error_message);
        
    } catch (Exception $e) {
        wc_add_notice($e->getMessage(), 'error');
        return [
            'result' => 'failure',
            'messages' => $e->getMessage()
        ];
    }
}
```

## Security Implementation

```php
private function validate_payment_fields() {
    // Validate nonce
    if (!wp_verify_nonce($_POST['payment_nonce'], 'process_payment')) {
        throw new Exception('Invalid security token');
    }
    
    // Validate required fields
    $required_fields = ['card_number', 'expiry', 'cvv'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception(sprintf('%s is required', ucfirst($field)));
        }
    }
    
    // Validate card number
    if (!$this->validate_card_number($_POST['card_number'])) {
        throw new Exception('Invalid card number');
    }
    
    // Validate expiry
    if (!$this->validate_expiry($_POST['expiry'])) {
        throw new Exception('Invalid expiry date');
    }
}

private function validate_card_number($number) {
    return preg_match('/^[0-9]{16}$/', preg_replace('/\s+/', '', $number));
}

private function validate_expiry($expiry) {
    if (!preg_match('/^(0[1-9]|1[0-2])\/([0-9]{2})$/', $expiry, $matches)) {
        return false;
    }
    
    $month = $matches[1];
    $year = '20' . $matches[2];
    
    return strtotime($year . '-' . $month . '-01') > strtotime('now');
}
```

## API Integration

```php
private function process_payment_request($data) {
    $api_key = $this->get_option('api_key');
    $is_sandbox = 'yes' === $this->get_option('sandbox_mode');
    
    $api_endpoint = $is_sandbox 
        ? 'https://api.sandbox.payment-provider.com/v1/charges'
        : 'https://api.payment-provider.com/v1/charges';
    
    $response = wp_remote_post($api_endpoint, [
        'headers' => [
            'Authorization' => 'Bearer ' . $api_key,
            'Content-Type' => 'application/json'
        ],
        'body' => json_encode($data),
        'timeout' => 30
    ]);
    
    if (is_wp_error($response)) {
        throw new Exception($response->get_error_message());
    }
    
    $body = json_decode(wp_remote_retrieve_body($response));
    
    if (wp_remote_retrieve_response_code($response) !== 200) {
        throw new Exception($body->error->message);
    }
    
    return $body;
}
```

## Error Handling

```php
private function handle_api_error($response) {
    $error_codes = [
        'card_declined' => 'The card was declined. Please try another card.',
        'insufficient_funds' => 'Insufficient funds on the card.',
        'expired_card' => 'The card has expired.',
        'invalid_cvc' => 'Invalid security code.',
        'processing_error' => 'An error occurred while processing the payment.'
    ];
    
    $error_code = $response->error->code;
    $message = isset($error_codes[$error_code]) 
        ? $error_codes[$error_code] 
        : 'An unknown error occurred';
    
    // Log error
    error_log(sprintf(
        'Payment processing error: %s (Code: %s)',
        $message,
        $error_code
    ));
    
    return $message;
}
```

## Refund Implementation

```php
public function process_refund($order_id, $amount = null, $reason = '') {
    $order = wc_get_order($order_id);
    
    if (!$order) {
        return new WP_Error('invalid_order', 'Invalid order ID');
    }
    
    $transaction_id = $order->get_transaction_id();
    
    if (!$transaction_id) {
        return new WP_Error('no_transaction', 'No transaction ID found');
    }
    
    try {
        $refund_result = $this->process_refund_request([
            'transaction_id' => $transaction_id,
            'amount' => $amount,
            'reason' => $reason
        ]);
        
        if ($refund_result->success) {
            $order->add_order_note(sprintf(
                'Refund of %s processed successfully. Refund ID: %s',
                wc_price($amount),
                $refund_result->refund_id
            ));
            
            return true;
        }
        
        return new WP_Error('refund_failed', $refund_result->error_message);
        
    } catch (Exception $e) {
        return new WP_Error('refund_error', $e->getMessage());
    }
}
```

## Conclusion

Building a custom payment gateway requires careful attention to security, error handling, and user experience. This implementation provides a solid foundation that you can extend based on your specific payment provider's requirements.
