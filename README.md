kodları çektikten sonra frontend ve backend klasörlerine gidip terminalde "npm install" komutlarını çalıştırarak bağımlılıkları yükleyin ve somee.com sitesinden oluşturduğunuz mssql serverındaki ayarları .env dosyasına geçirin.

backend klasöründe "node server.js" ile backend sunucunuzu başlatın ve frontend klasöründe "npm run dev" komutunu girerek frontend sunucunuzu başlatın.

eğer veri tabanında bir tablo oluşmazsa ve hata verirse şu adımları izleyin:
1- somee.com sitesindeki databases kısmından oluşturduğunuz veri tabanına girin --> Run Scripts --> Open T-SQL console
2-Şu sorguyu girip veri tabanında bir table oluşturun:
  """
  CREATE TABLE Users (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100),
  Email NVARCHAR(100)
  );
  """
