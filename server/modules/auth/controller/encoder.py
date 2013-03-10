#encriptation dependencies:
from Crypto.Cipher import AES
from Crypto import Random
import base64
import os

#http://www.codekoala.com/blog/2009/aes-encryption-python-using-pycrypto/
BLOCK_SIZE = 32

# the character used for padding--with a block cipher such as AES, the value
# you encrypt must be a multiple of BLOCK_SIZE in length.  This character is
# used to ensure that your value is always a multiple of BLOCK_SIZE
PADDING = '{'

# one-liner to sufficiently pad the text to be encrypted
pad = lambda s: s + (BLOCK_SIZE - len(s) % BLOCK_SIZE) * PADDING

# one-liners to encrypt/encode and decrypt/decode a string
# encrypt with AES, encode with base64
EncodeAES = lambda c, s: base64.b64encode(c.encrypt(pad(s)))
DecodeAES = lambda c, e: c.decrypt(base64.b64decode(e)).rstrip(PADDING)

class Encoder:
    def __init__(self):
        #salt from: http://passwordsgenerator.net/
        self.email_key = "*]Yw,6(pju,T)T]@5S>/9Xs/<Sw5[36bs,"
        self.passw_salt = "3^h(R~&Q*39Q';;m2JdqB!`.nsns!V<,>"

    def encode_email(self, user_email):
        key  = pad(self.email_key)[:32]        
        #lets encrypt
        return self.aes_encrypt(user_email, key)
    
    def decode_email(self, user_email):
        key  = pad(self.email_key)[:32]
        #lets decrypt
        return self.aes_decrypt(user_email, key) 
    
    def encode_pass(self, user_email, user_password):
        #lets hash
        from Crypto.Hash import SHA512
        import binascii
        h = SHA512.new()
        h.update(user_password)
        new_user_password = binascii.b2a_base64(h.digest())

        #now we need a key
        salt = self.passw_salt
        k = SHA512.new()
        k.update((user_email + salt) + salt + (user_password + salt))
        key = binascii.b2a_base64(k.digest())
        key = pad(key)[:32]

        #lets encrypt
        return self.aes_encrypt(new_user_password, key) 

    def aes_encrypt( self, raw, key):
        return EncodeAES(AES.new(key), raw) 

    def aes_decrypt( self, enc, key):
        return DecodeAES(AES.new(key), enc)

