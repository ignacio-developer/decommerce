<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Filament\Resources\OrderResource\RelationManagers\OrderItemsRelationManager;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Gdinko\Econt\Models\CarrierEcontCity;
use Gdinko\Econt\Models\CarrierEcontOffice;
use Gdinko\Econt\Models\CarrierEcontStreet;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\DB;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationLabel = 'Orders';


    protected static ?string $pluralLabel = 'Orders';

    protected static ?string $label = 'Order';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Customer data')
                    ->collapsed()
                    ->schema([
                        Forms\Components\TextInput::make('full_name')
                            ->label('Name')
                            ->required(),
                        Forms\Components\TextInput::make('phone')
                            ->label('Phone')
                            ->required(),
                        Forms\Components\TextInput::make('email')
                            ->label('Email')
                            ->required()->email(),
                    ])->columns(3),
                Forms\Components\Section::make('Address')
                    ->collapsed()
                    ->schema([
                        Forms\Components\Select::make('delivery_type')
                            ->label('Delivery to office/address')
                            ->options([
                                'econt_office' => 'Econt office',
                                'courier' => 'Delivery by courier',
                            ])
                            ->required(),

                        Select::make('econt_city_id')
                            ->label('City')
                            ->required()
                            ->options(CarrierEcontCity::pluck('name', 'id'))
                            ->live()
                            ->searchable(),

                        Select::make('econt_office_id')
                            ->label('Office')
                            ->required()
                            ->options(function (callable $get) {
                                $cityId = $get('econt_city_id');

                                return $cityId
                                    ? CarrierEcontOffice::where('econt_city_id', $cityId)->pluck('name', 'id')
                                    : [];
                            })
                            ->live()
                            ->visible(fn (callable $get) => $get('delivery_type') === 'econt_office'),

                        Select::make('econt_street_id')
                            ->label('Street')
                            ->required()
                            ->live()
                            ->options(function (callable $get) {
                                $cityId = $get('econt_city_id');

                                return $cityId
                                    ? CarrierEcontStreet::where('econt_city_id', $cityId)->pluck('name', 'id')
                                    : [];
                            })
                            ->searchable()
                            ->visible(fn (callable $get) => $get('delivery_type') === 'courier'),

                        Forms\Components\TextInput::make('econt_street_number')
                            ->label('Street Number')
                            ->required()
                            ->visible(fn (callable $get) => $get('delivery_type') === 'courier'),
                    ])
                    ->columns(3),

                Forms\Components\TextInput::make('subtotal')
                    ->label('Amount without discount')
                    ->numeric()
                    ->required(),

                Forms\Components\TextInput::make('total')
                    ->label('Total')
                    ->numeric()
                    ->live()
                    ->required(),
                Forms\Components\Textarea::make('order_notes')
                    ->label('Order notes')
                    ->columnSpan('full'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('full_name')
                    ->label('Name'),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email'),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Phone'),
                Tables\Columns\TextColumn::make('total')
                    ->label('Total')
                    ->suffix('$'),
                Tables\Columns\TextColumn::make('created_at')->dateTime()
                    ->label('Created at'),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            OrderItemsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

}
