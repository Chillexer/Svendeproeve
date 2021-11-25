using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace FNO.DataAccess.Database.Models
{
    internal class ProductSeedModel
    {
        [JsonPropertyName("brand")]
        public string Brand { get; set; }
        [JsonPropertyName("model")]
        public string Model { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("gender")]
        public string Gender { get; set; }
        [JsonPropertyName("price")]
        public decimal Price { get; set; }
        [JsonPropertyName("categories")]
        public List<string> Categories { get; set; }
        [JsonPropertyName("variants")]
        public List<VariantSeedModel> Variants { get; set; }
    }

    internal class VariantSeedModel
    {
        [JsonPropertyName("productId")]
        public string ProductId { get; set; }
        [JsonPropertyName("imageUrl")]
        public string ImageUrl { get; set; }
        [JsonPropertyName("discountPrice")]
        public decimal? DiscountPrice { get; set; }
        [JsonPropertyName("color")]
        public string Color { get; set; }
    }
}
