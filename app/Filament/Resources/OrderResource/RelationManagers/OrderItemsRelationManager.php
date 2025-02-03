<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use App\Models\Order;
use App\Models\Product;
use Closure;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\DB;

class OrderItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'orderItems';

    protected static ?string $recordTitleAttribute = 'Продукти';

    protected static ?string $title = 'Продукти';
    protected static ?string $pluralLabel = 'Продукти';

    protected static ?string $label = 'Продукт';


    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('product_id')
                    ->label('Продукт')
                    ->placeholder('Избери продукт')
                    ->reactive()
                    ->options(
                        Product::query()
                            ->orderBy('name')
                            ->pluck('name', 'id')
                    )
                    ->afterStateUpdated(function (callable $set, callable $get, $state) {
                        $product = Product::find($state);
                        if ($product) {
                            $set('product_name', $product->name);
                            if ($product->on_sale) {
                                $set('single_price', $product->on_sale_price);
                            } else {
                                $set('single_price', $product->price);
                            }
                        }

                        $this->updateOrderTotal($get);
                    })
                    ->searchable()
                    ->required(),

                Forms\Components\TextInput::make('product_name')
                    ->label('Име на продукта')
                    ->required(),

                Forms\Components\TextInput::make('quantity')
                    ->label('Брой')
                    ->numeric()
                    ->reactive()
                    ->afterStateUpdated(function (callable $get) {
                        $this->updateOrderTotal($get);
                    })
                    ->required(),

                Forms\Components\TextInput::make('single_price')
                    ->label('Единична цена')
                    ->numeric()
                    ->reactive()
                    ->afterStateUpdated(function (callable $get) {
                        $this->updateOrderTotal($get);
                    })
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                Tables\Columns\TextColumn::make('product_id')
                ->label('ID'),
                Tables\Columns\TextColumn::make('product_name')
                ->label('Име на продукта'),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Брой'),
                Tables\Columns\TextColumn::make('single_price')
                    ->label('Единична цена'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                ->label('Добави Продукт')
                    ->after(function ($action) {
                        $action->getLivewire()->dispatch('refreshForm');
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->after(function ($action) {
                        $this->updateOrderTotalAfterDelete();
                        $action->getLivewire()->dispatch('refreshForm');
                    }),
                Tables\Actions\DeleteAction::make()
                    ->after(function ($action) {
                        $this->updateOrderTotalAfterDelete();
                        $action->getLivewire()->dispatch('refreshForm');
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                ]),
            ]);
    }


    protected function updateOrderTotal(callable $get)
    {
        $quantity = $get('quantity');
        $singlePrice = $get('single_price');

        if ($quantity && $singlePrice) {
            $totalForItem = $quantity * $singlePrice;

            $order = $this->ownerRecord;
            if ($order) {
                $currentTotal = $order->orderItems()->sum(DB::raw('quantity * single_price'));

                $newTotal = $currentTotal + $totalForItem;

                $order->update(['total' => $newTotal]);
            }
        }
    }

    protected function updateOrderTotalAfterDelete()
    {
        $order = $this->ownerRecord;

        if ($order) {
            $newTotal = $order->orderItems()->sum(DB::raw('quantity * single_price'));

            $order->update(['total' => $newTotal]);
        }
    }

}
