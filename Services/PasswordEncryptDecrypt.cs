using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace TrucksUpFoAdmin.Services
{
    public class PasswordEncryptDecrypt
    {
        public static string EncryptString(string plainText)
        {
            try
            {
                byte[] iv = new byte[16];
                byte[] array;
                string keyToUse = getEncyptionKey();
                using (Aes aes = Aes.Create())
                {
                    aes.Key = Encoding.UTF8.GetBytes(Get128BitString(keyToUse));
                    aes.IV = iv;

                    ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                            {
                                streamWriter.Write(plainText);
                            }

                            array = memoryStream.ToArray();
                        }
                    }
                }

                return Convert.ToBase64String(array);
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
                return "";
            }
        }

        public static string DecryptString(string cipherText)
        {
            try
            {
                cipherText = cipherText.Replace(" ", "+");
                byte[] iv = new byte[16];
                string keyToUse = getEncyptionKey();
                byte[] buffer = Convert.FromBase64String(cipherText);
                using (Aes aes = Aes.Create())
                {
                    aes.Key = Encoding.UTF8.GetBytes(Get128BitString(keyToUse));
                    aes.IV = iv;
                    ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                    using (MemoryStream memoryStream = new MemoryStream(buffer))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                            {
                                return streamReader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
                return "";
            }
        }

        public static string Get128BitString(string keyToConvert)
        {
            StringBuilder b = new StringBuilder();
            for (int i = 0; i < 16; i++)
            {
                b.Append(keyToConvert[i % keyToConvert.Length]);
            }
            keyToConvert = b.ToString();
            return keyToConvert;
        }

        public static string getEncyptionKey()
        {
            string Key = "";
            try
            {
                string QueryString = "EXEC Pro_GetEncrptedKey";
                dal d = dal.GetInstance();
                DataSet ds = d.GetDataSet(QueryString);
                if (ds != null && ds.Tables[0].Rows.Count > 0)
                {
                    Key = ds.Tables[0].Rows[0]["EncryptionKey"].ToString();
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return Key;
        }
    }
}