import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import sass from 'sass'
import webpack from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'

import Dotenv from 'dotenv-webpack'

const isProd = process.env.NODE_ENV === 'production'

const config: webpack.Configuration & { devServer?: DevServerConfiguration } = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: isProd ? 'js/[name].[contenthash].js' : 'js/[name].js',
		chunkFilename: isProd
			? 'js/[name].[contenthash].chunk.js'
			: 'js/[name].chunk.js',
		clean: true,
		publicPath: '/',
	},

	mode: isProd ? 'production' : 'development',
	devtool: isProd ? false : 'source-map',

	optimization: {
		minimize: isProd,
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
		runtimeChunk: {
			name: 'runtime',
		},
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},

	devServer: {
		port: 3002,
		hot: true,
		open: true,
		historyApiFallback: true,
	},

	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript',
						],
					},
				},
			},
			{
				test: /\.(png|jpg|jpeg|gif|webp)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.module\.s[ac]ss$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[name]__[local]--[hash:base64:5]',
							},
							sourceMap: true,
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							implementation: sass,
						},
					},
				],
			},

			{
				test: /\.s[ac]ss$/i,
				exclude: /\.module\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							implementation: sass,
						},
					},
				],
			},

			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext][query]',
				},
			},

			{
				test: /\.(png|jpe?g|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext][query]',
				},
			},

			{
				test: /\.svg$/,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
		}),
		new Dotenv(),
	],
}

export default config
