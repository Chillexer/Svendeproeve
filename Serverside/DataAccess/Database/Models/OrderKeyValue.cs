using System;

namespace FNO.DataAccess.Database.Models
{
    public class OrderKeyValue
    {
        public OrderKeyValue(DateTime key, int value)
        {
            Key = key;
            Value = value;
        }

        public DateTime Key { get; set; }
        public int Value { get; set; }
    }
}
