using FNO.DataAccess.Database.Models;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Text;

namespace FNO.DataAccess.Database.Mail
{
    public static class Mail
    {
        const string fromPassword = "yfhmmcjmzveuxaal";
        const string mailTemplateResourceName = "FNO.DataAccess.Database.Mail.Templates.MailTemplate.html";
        const string productTemplateResourceName = "FNO.DataAccess.Database.Mail.Templates.ProductTemplate.html";
        const string discountPriceTemplateResourceName = "FNO.DataAccess.Database.Mail.Templates.DiscountPriceTemplate.html";
        const string priceTemplateResourceName = "FNO.DataAccess.Database.Mail.Templates.PriceTemplate.html";

        static string mailTemplate = "";
        static string productTemplate = "";
        static string discountPriceTemplate = "";
        static string priceTemplate = "";

        public static void SendMail(Order order)
        {
            LoadTemplates();
            var body = CreateBody(order);
            var fromAddress = new MailAddress("fno.svendeproeve@gmail.com", "Svendeprøve");
            var toAddress = new MailAddress(order.Email, (order.FirstName + " " + order.LastName));
            string subject = $"Ordre bekræftigelse #{order.Id}";

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            smtp.Send(message);
        }

        private static string CreateBody(Order order)
        {
            var body = mailTemplate;
            var products = "";

            foreach (var vo in order.VariantOrders)
            {
                var tempProduct = productTemplate;
                var tempPriceTemplate = vo.DiscountPrice.HasValue ? discountPriceTemplate : priceTemplate;
                if (vo.DiscountPrice.HasValue)
                    tempPriceTemplate = tempPriceTemplate.Replace("[DiscountPrice]", (vo.DiscountPrice.Value * vo.OrderedItemsTotal).ToString("F"));
                tempPriceTemplate = tempPriceTemplate.Replace("[Price]", (vo.Price * vo.OrderedItemsTotal).ToString("F"));
                tempProduct = tempProduct.Replace("[Price]", tempPriceTemplate);
                tempProduct = tempProduct.Replace("[ImageSrc]", vo.Variant.ImagePath);
                tempProduct = tempProduct.Replace("[Brand]", vo.Variant.Product.Brand);
                tempProduct = tempProduct.Replace("[Model]", vo.Variant.Product.Model);
                tempProduct = tempProduct.Replace("[Color]", vo.Variant.Colors.FirstOrDefault().ColorName);
                tempProduct = tempProduct.Replace("[Size]", vo.Size.SizeName);
                tempProduct = tempProduct.Replace("[OrderedTotalAmount]", vo.OrderedItemsTotal.ToString());

                products += tempProduct;
            }

            body = body.Replace("[OrderNumber]", order.Id.ToString());
            body = body.Replace("[Products]", products);
            body = body.Replace("[ProductCount]", order.VariantOrders.Sum(v => v.OrderedItemsTotal).ToString());
            body = body.Replace("[TotalPrice]", order.VariantOrders.Sum(v => v.OrderedItemsTotal * (v.DiscountPrice ?? v.Price)).ToString());
            return body;
        }

        private static void LoadTemplates()
        {
            if (string.IsNullOrEmpty(mailTemplate))
                mailTemplate = GetTemplate(mailTemplateResourceName);
            if (string.IsNullOrEmpty(productTemplate))
                productTemplate = GetTemplate(productTemplateResourceName);
            if (string.IsNullOrEmpty(discountPriceTemplate))
                discountPriceTemplate = GetTemplate(discountPriceTemplateResourceName);
            if (string.IsNullOrEmpty(priceTemplate))
                priceTemplate = GetTemplate(priceTemplateResourceName);
        }

        private static string GetTemplate(string resourceName)
        {
            Assembly assembly = Assembly.GetExecutingAssembly();
            using Stream stream = assembly.GetManifestResourceStream(resourceName);
            using var reader = new StreamReader(stream, Encoding.UTF8);
            return reader.ReadToEnd();
        }

    }
}


