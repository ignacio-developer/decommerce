<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Filament\Resources\CouponResource\RelationManagers;
use App\Models\Coupon;
use Filament\Actions\DeleteAction;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Closure;
use Illuminate\Support\HtmlString;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';

    protected static ?string $navigationLabel = 'Coupons';
    protected static ?string $pluralLabel = 'Coupons';

    protected static ?string $label = 'Coupon';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('coupon_code')
                    ->label('Coupon Code')
                    ->required()
                    ->hint(
                        function ($component) {
                            // generate random code
                            $randomCode = self::generateCode();

                            $hint = /** @lang text */
                                '
                    <span wire:click="$set(\'' . $component->getStatePath() . '\', \'' . $randomCode . '\')" class="font-medium h- px-2 py-0.5 rounded-xl bg-primary-500 text-white text-xs tracking-tight mt-[10px] cursor-pointer">
                        Създай случаен код
                    </span>
                ';

                            return new HtmlString($hint);
                        }
                    )
                    ->maxLength(191),

                Forms\Components\TextInput::make('percent')
                    ->label('Discount percentage')
                    ->numeric()
                    ->minValue(0)
                    ->maxValue(100),
                Forms\Components\Toggle::make('is_active')
                    ->label('Is active')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('coupon_code')
                    ->label('Coupon Code'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Is Active')
                    ->boolean()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('percent')
                    ->label('Discount percentage')
                    ->alignCenter()
                    ->suffix('%')
            ])
            ->filters([
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'edit' => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }

    private static function generateCode($length = 6): string
    {
        // generate random code without 0, O, I, l
        $characters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $coupon_code = '';
        for ($i = 0; $i < $length; $i++) {
            $coupon_code .= $characters[rand(0, $charactersLength - 1)];
        }
        // check if code already exists
        if (Coupon::where('coupon_code', $coupon_code)->exists()) {
            return self::generateCode($length);
        }

        return $coupon_code;
    }

}
