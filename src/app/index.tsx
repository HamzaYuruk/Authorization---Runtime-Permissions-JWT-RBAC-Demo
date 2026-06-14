import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  // --- HAFIZA (STATE) ---
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [girisYapildiMi, setGirisYapildiMi] = useState(false);
  const [token, setToken] = useState('');

  // --- KULLANICI LİSTESİ STATE ---
  const [kullaniciListesi, setKullaniciListesi] = useState([
    { ad: 'hamza', rol: 'admin' },
    { ad: 'osman', rol: 'user' },
  ]);
  const [listeGoster, setListeGoster] = useState(false);

  // --- KULLANICI EKLE STATE (sadece admin kullanır) ---
  const [yeniAd, setYeniAd] = useState('');
  const [yeniRol, setYeniRol] = useState('user');

  // --- BASE64URL FONKSİYONU ---
  const base64url = (str: string) => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  // --- JWT TOKEN ÜRETME FONKSİYONU ---
  const tokenUret = async (kullaniciAdi: string, rol: string) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      username: kullaniciAdi,
      role: rol,
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    const headerBase64 = base64url(JSON.stringify(header));
    const payloadBase64 = base64url(JSON.stringify(payload));
    const veri = `${headerBase64}.${payloadBase64}`;
    const imza = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      veri + 'gizli-anahtar-123'
    );
    return `${veri}.${imza}`;
  };

  // --- TOKEN'DAN ROLE OKU ---
  const getRol = () => {
    if (!token) return null;
    return (jwtDecode(token) as any).role;
  };

  // --- GİRİŞ KONTROL FONKSİYONU ---
  const handleLogin = async () => {
    if (kullaniciAdi === 'hamza' && sifre === '1234') {
      const uretilmisToken = await tokenUret(kullaniciAdi, 'admin');
      setToken(uretilmisToken);
      setGirisYapildiMi(true);
    } else if (kullaniciAdi === 'osman' && sifre === '1234') {
      const uretilmisToken = await tokenUret(kullaniciAdi, 'user');
      setToken(uretilmisToken);
      setGirisYapildiMi(true);
    } else {
      Alert.alert('Hata', 'Kullanıcı adı veya şifre yanlış!');
    }
  };

  // --- ÇIKIŞ YAP FONKSİYONU ---
  const handleLogout = () => {
    setGirisYapildiMi(false);
    setKullaniciAdi('');
    setSifre('');
    setToken('');
    setListeGoster(false);
  };

  // --- KULLANICI EKLE FONKSİYONU (sadece admin) ---
  const handleKullaniciEkle = () => {
    if (!yeniAd.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı boş olamaz!');
      return;
    }
    setKullaniciListesi([...kullaniciListesi, { ad: yeniAd, rol: yeniRol }]);
    setYeniAd('');
    Alert.alert('Başarılı', `${yeniAd} kullanıcısı eklendi!`);
  };

  // --- KAMERA İZNİ FONKSİYONU ---
  const handleKameraIzni = async () => {
    const izinSonucu = await ImagePicker.requestCameraPermissionsAsync();
    if (izinSonucu.granted) {
      Alert.alert('İzin Verildi', 'Kamera iznine sahipsiniz!');
    } else {
      Alert.alert(
        'İzin Gerekli',
        'Kamera izni gerekli. Ayarlardan açabilirsiniz.',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Ayarlara Git', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  // --- DASHBOARD EKRANI ---
  if (girisYapildiMi) {
    const rol = getRol();
    return (
      <ScrollView contentContainerStyle={styles.container}>

        {/* BAŞLIK */}
        <Text style={styles.title}>Hoş Geldin, {kullaniciAdi}!</Text>
        <Text style={{ fontSize: 18, marginBottom: 30, color: rol === 'admin' ? '#007BFF' : '#28a745' }}>
          Rol: {rol?.toUpperCase()}
        </Text>

        {/* JWT TOKEN KUTUSU */}
        <Text style={styles.sectionTitle}>JWT Token:</Text>
        <View style={styles.tokenKutusu}>
          <Text style={styles.tokenText} selectable={true}>{token}</Text>
        </View>

        {/* RBAC - ROL BAZLI İÇERİK */}
        <Text style={styles.sectionTitle}>Rol Bazlı İçerik:</Text>

        {/* KULLANICI LİSTESİ - HER İKİ ROL */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#17a2b8', marginBottom: 10 }]}
          onPress={() => setListeGoster(!listeGoster)}>
          <Text style={styles.buttonText}>
            {listeGoster ? 'Listeyi Kapat' : 'Kullanıcıları Görüntüle'}
          </Text>
        </TouchableOpacity>

        {listeGoster && (
          <View style={styles.rbacKutusu}>
            {kullaniciListesi.map((k, index) => (
              <Text key={index} style={styles.rbacItem}>
                • {k.ad} - {k.rol}
              </Text>
            ))}
          </View>
        )}

        {/* KULLANICI EKLE - SADECE ADMİN */}
        {rol === 'admin' && (
          <View style={[styles.rbacKutusu, { borderColor: '#007BFF', marginTop: 10 }]}>
            <Text style={styles.rbacBaslik}>👑 Kullanıcı Ekle</Text>
            <TextInput
              style={styles.input}
              placeholder="Kullanıcı adı"
              value={yeniAd}
              onChangeText={setYeniAd}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: yeniRol === 'admin' ? '#007BFF' : '#28a745' }]}
              onPress={() => setYeniRol(yeniRol === 'admin' ? 'user' : 'admin')}>
              <Text style={styles.buttonText}>Rol: {yeniRol.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#007BFF', marginTop: 10 }]}
              onPress={handleKullaniciEkle}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* KAMERA İZNİ - HER İKİ ROL */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#6f42c1', marginTop: 10 }]}
          onPress={handleKameraIzni}>
          <Text style={styles.buttonText}>Kameraya Eriş</Text>
        </TouchableOpacity>

        {/* ÇIKIŞ BUTONU */}
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>

      </ScrollView>
    );
  }

  // --- LOGIN EKRANI ---
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sisteme Giriş</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={kullaniciAdi}
        onChangeText={setKullaniciAdi}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={sifre}
        onChangeText={setSifre}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- TASARIM ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f4f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#007BFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tokenKutusu: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  tokenText: {
    color: '#00ff99',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  rbacKutusu: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  rbacBaslik: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  rbacItem: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
});