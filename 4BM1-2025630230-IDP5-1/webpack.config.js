const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/Application.jsx",
    output: {
    path:path.resolve(__dirname, '../4BM1-2025630449-IDPF-BE/public'),
    //path:path.resolve(__dirname, 'dist'),
    filename: "main.js",
    clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './plantilla/index.html', // Ruta plantilla HTML
          path:path.resolve(__dirname, '../4BM1-2025630449-IDPF-BE/public'),
          //path:path.resolve(__dirname, 'dist'),
          filename: 'index.html', // Nombre del archivo de salida
        })
      ],
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
          },
          {
            test: /\.(mp3|mpeg)$/i,
            type: 'asset/resource',
          }
        ]
      },
    devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), 
    },
    port: 3000, // Puerto del dev-server (evita colisión con el backend en 8080)
    open: true, // Abrir navegador automáticamente
    hot: true, // Habilitar Hot Module Replacement (HMR)
    historyApiFallback: true, // Aplicaciones SPA
  }            
  }
