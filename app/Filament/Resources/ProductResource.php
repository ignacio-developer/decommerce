<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $navigationGroup = 'Products';
    protected static ?string $navigationLabel = 'Products';
    protected static ?string $pluralLabel = 'Products';

    protected static ?string $label = 'Product';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name')
                    ->label('Category')
                    ->required(),
                Forms\Components\TextInput::make('name')
                    ->label('Name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->label('Description')
                    ->rows(5)
                    ->required(),
                Forms\Components\TextInput::make('price')
                    ->label('Price')
                    ->required()
                    ->lazy()
                    ->numeric()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, callable $set) {
                        self::updateSalePrice($set);
                    }),
                Forms\Components\TextInput::make('quantity')
                    ->label('Quantity')
                    ->required()
                    ->numeric(),
                Forms\Components\Toggle::make('on_sale')
                    ->label('On Sale')
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, callable $set) {
                        self::updateSalePrice($set);
                    }),
                Forms\Components\TextInput::make('on_sale_percent')
                    ->label('On Sale Discount Percentage')
                    ->visible(fn ($get) => $get('on_sale'))
                    ->numeric()
                    ->nullable()
                    ->lazy()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, callable $set) {
                        self::updateSalePrice($set);
                    }),
                Forms\Components\TextInput::make('on_sale_price')
                    ->label('On Sale Price')
                    ->visible(fn ($get) => $get('on_sale'))
                    ->numeric()
                    ->live(onBlur: true)
                    ->hint('Calculated automatically'),

            ])->columns(2);
    }



    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Id'),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category'),
                Tables\Columns\TextColumn::make('name')
                    ->label('Name'),
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->suffix('$'),
                Tables\Columns\TextColumn::make('on_sale_price')
                    ->label('On Sale Price')
                    ->alignCenter()
                    ->suffix('$'),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantity')
                    ->alignCenter(),
                Tables\Columns\IconColumn::make('on_sale')
                    ->label('On Sale')
                    ->boolean()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('on_sale_percent')
                    ->label('On Sale Discount Percentage')
                    ->formatStateUsing(fn($state) => $state ? "{$state}%" : 'N/A')
                    ->alignCenter(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
//                Tables\Actions\CreateAction::make()
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ImagesRelationManager::class,
            RelationManagers\ReviewsRelationManager::class

        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }

    protected static function updateSalePrice(callable $set)
    {
        $set('on_sale_price', function ($get) {
            $price = $get('price');
            $onSalePercent = $get('on_sale_percent');
            $onSale = $get('on_sale');

            if ($onSale && $price && $onSalePercent) {
                return $price - ($price * $onSalePercent / 100);
            }

            return null;
        });
    }


}
