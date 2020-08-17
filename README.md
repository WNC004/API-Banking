# API-Banking
wnc

Đối với các ngân hàng RSA

API truy vấn thông tin

url: /RSABank/users

method: POST

headers: 
{
  ts: thời gian gửi gói tin được đổi thành timestamp,
  partner_code: code dùng để xác nhận gói tin có được gửi từ ngân hàng liên kết hay không 
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
data:{
  [
    {
      
    }
  ]
}

Lưu ý: 
Ngân hàng liên kết cung cấp 1 khoá secretKey dùng để tạo chữ ký và không được chia sẻ cho ai khác

API chuyển tiền

Đối với các ngân hàng PGP

API truy vấn thông tin

url: /PGPBank/users

method: POST

headers: 
{
  ts: thời gian gửi gói tin được đổi thành timestamp,
  partner_code: code dùng để xác nhận gói tin có được gửi từ ngân hàng liên kết hay không 
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
data:{
  
}

Lưu ý: 
Ngân hàng liên kết cung cấp 1 khoá secretKey dùng để tạo chữ ký và không được chia sẻ cho ai khác

API chuyển tiền
