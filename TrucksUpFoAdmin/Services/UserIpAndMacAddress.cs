using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Net;
using System.Web;

namespace TrucksUpFoAdmin.Services
{
    public class UserIpAndMacAddress
    {
        public static string[] GetAllLocalIPv4(NetworkInterfaceType _type)
        {
            List<string> ipAddrList = new List<string>();
            try
            {
                foreach (NetworkInterface item in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (item.NetworkInterfaceType == _type && item.OperationalStatus == OperationalStatus.Up)
                    {
                        foreach (UnicastIPAddressInformation ip in item.GetIPProperties().UnicastAddresses)
                        {
                            if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                            {
                                ipAddrList.Add(ip.Address.ToString());
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }

            return ipAddrList.ToArray();
        }

        public static string GetIPAddress()
        {
            string IPAddress = "";
            IPHostEntry Host = default(IPHostEntry);
            string Hostname = null;
            Hostname = System.Environment.MachineName;
            Host = Dns.GetHostEntry(Hostname);
            foreach (IPAddress IP in Host.AddressList)
            {
                if (IP.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    IPAddress = Convert.ToString(IP);
                }
            }
            return IPAddress;
        }

        public static string GetMacAddress()
        {
            const int MIN_MAC_ADDR_LENGTH = 12;
            string macAddress = string.Empty;
            long maxSpeed = -1;
            try
            {
                foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
                {
                    //log.Debug("Found MAC Address: " + nic.GetPhysicalAddress() + " Type: " + nic.NetworkInterfaceType);
                    string tempMac = nic.GetPhysicalAddress().ToString();
                    if (nic.Speed > maxSpeed &&
                        !string.IsNullOrEmpty(tempMac) &&
                        tempMac.Length >= MIN_MAC_ADDR_LENGTH)
                    {
                        // log.Debug("New Max Speed = " + nic.Speed + ", MAC: " + tempMac);
                        maxSpeed = nic.Speed;
                        macAddress = tempMac;
                    }
                }
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return macAddress;
        }

        public static string getDeviceName()
        {
            string Platform = "";
            try
            {
                HttpBrowserCapabilities capability = HttpContext.Current.Request.Browser;
                var BrowserName = capability.Browser;
                var version = capability.Version;
                var platform = capability.Platform;
                Platform = platform.ToString();
            }
            catch (Exception ex)
            {
                new ExceptionLogging(ex);
            }
            return Platform;
        }
    }
}