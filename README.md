# API-Banking
wnc

# API sử dụng cơ chế mã hoá PGP

# Đối với các ngân hàng RSA

# API truy vấn thông tin

url: https://wnc-api-banking.herokuapp.com/api/RSABank/users

method: POST

headers: 

{

  ts: thời gian gửi gói tin được đổi thành timestamp,
  
  partner_code: code dùng để xác nhận gói tin có được gửi từ ngân hàng liên kết hay không ,
  
  sign: chữ ký được hash bởi gói tin và thời gian gửi dùng để xác nhận chữ ký có được gửi từ ngân hàng liên kết hay không

}

body: 

{

  accountID: số tài khoản của tài khoản cần truy vấn thông tin

}

response: 

// Sai chữ ký

status: 400

{

  'Signature is wrong!'

}

// Sai partner-code

status: 400

{

'Invalid partner code!'

}

// Gói tin đã hết hạn sau 10 phút

status: 400

{

Request expire!

}

status: 201

data:

{

Thông tin ngân hàng liên kết yêu cầu

}

Lưu ý: 

Ngân hàng liên kết cung cấp 1 khoá secretKey dùng để tạo chữ ký và không được chia sẻ cho ai khác

# API nộp tiền vào tài khoản

url: https://wnc-api-banking.herokuapp.com/api/RSATransfer

method: POST

headers: 

{

  ts: thời gian gửi gói tin được đổi thành timestamp,
  
  partner_code: code dùng để xác nhận gói tin có được gửi từ ngân hàng liên kết hay không,
  
  sign: chữ ký được hash bởi gói tin và thời gian gửi dùng để xác nhận chữ ký có được gửi từ ngân hàng liên kết hay không

}

body: 

{

  accountID: số tài khoản của tài khoản cần chuyển tiền

  newBalance: số tiền cần chuyển
  
  message: nội dung thưc hiện giao dịch
  
  senderName: tên chủ tài khoản người chuyển
  
  senderNumber: số tài khoản của tài khoản người chuyển

}

response: 

// Sai chữ ký

status: 400

{

  'Signature is wrong!'

}

// Sai partner-code

status: 400
{

'Invalid partner code!'

}

// Gói tin đã hết hạn sau 10 phút

status: 400

{

'Request expire!'

}

// Không thể xác nhận gói tin được ký bất đối xứng 

status: 500

{

cleartext

}

status: 201

data:

{

cleartext 

}

Lưu ý: 

Ngân hàng liên kết cung cấp 1 khoá secretKey dùng để tạo chữ ký và không được chia sẻ cho ai khác

Ngân hàng liên kết cung cấp một public key dùng để xác nhận gói tin yêu cầu chuyển tiền được ký bất đối xứng

Ngân hàng nguồn cung cấp một public key để ngân hàng liên kết để xác nhận gói tin kết quả thực giao dịch được ký bất đối xứng

# Đối với các ngân hàng PGP

# API truy vấn thông tin

url: https://wnc-api-banking.herokuapp.com/api/PGPBank/users

method: POST

headers: 

{

  ts: thời gian gửi gói tin được đổi thành timestamp,
  
  partner_code: code dùng để xác nhận gói tin có được gửi từ ngân hàng liên kết hay không,
  
  sign: chữ ký được hash bởi gói tin và thời gian gửi dùng để xác nhận chữ ký có được gửi từ ngân hàng liên kết hay không
  
}

body: 

{

  accountID: số tài khoản của tài khoản cần chuyển tiền

  newBalance: số tiền cần chuyển
  
  message: nội dung thưc hiện giao dịch
  
  senderName: tên chủ tài khoản người chuyển
  
  senderNumber: số tài khoản của tài khoản người chuyển
  
}

response: 

// Sai chữ ký

status: 400

{

  'Signature is wrong!'
  
}

// Sai partner-code

status: 400

{

  'Invalid partner code!'
  
}

// Gói tin đã hết hạn sau 10 phút

status: 400

{

  Request expire!
  
}

status: 201

data:

{
  
  Thông tin ngân hàng liên kết yêu cầu
  
}

Lưu ý: 

Ngân hàng liên kết cung cấp 1 khoá secretKey dùng để tạo chữ ký và không được chia sẻ cho ai khác

Ngân hàng liên kết và ngân hàng nguồn chia sẻ một cặp key để ký bất đối xứng lên giao dịch


# API nộp tiền vào tài khoản 

url: https://wnc-api-banking.herokuapp.com/api/PGPTransfer

method: POST

headers: 

{

  ts: thời gian gửi gói tin được đổi thành timestamp,
  
  partner_code: code dùng để xác nhận gói tin có được gửi từ ngân hàng liên kết hay không,
  
  sign: chữ ký được hash bởi gói tin và thời gian gửi dùng để xác nhận chữ ký có được gửi từ ngân hàng liên kết hay không
  
}

body: 

{

  accountID: số tài khoản của tài khoản cần truy vấn thông tin

}

response: 

// Sai chữ ký

status: 400

{

  'Signature is wrong!'

}

// Sai partner-code

status: 400

{

'Invalid partner code!'

}

// Gói tin đã hết hạn sau 10 phút

status: 400

{

Request expire!

}

// Không thể xác nhận gói tin được ký bất đối xứng 

status: 500

data: 

{

cleartext

}


status: 201

data:

{

cleartext

}

Lưu ý: 

Ngân hàng liên kết cung cấp 1 khoá secretKey dùng để tạo chữ ký và không được chia sẻ cho ai khác

Ngân hàng liên kết cung cấp một public key dùng để xác nhận gói tin yêu cầu chuyển tiền được ký bất đối xứng

Ngân hàng nguồn cung cấp một public key để ngân hàng liên kết để xác nhận gói tin kết quả thực giao dịch được ký bất đối xứng

